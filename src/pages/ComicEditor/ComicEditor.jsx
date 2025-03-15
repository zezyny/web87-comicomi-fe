import { React, useState, useCallback, useRef, useEffect } from 'react'
import "./ComicEditor.css"
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useDrag, useDrop } from 'react-dnd';
import chapterApi from '../dashboard/chapterapi';
import Header from '../../components/commons/header'
import { useCookies } from 'react-cookie';
import { useParams } from 'react-router-dom';
import {Buffer} from 'buffer';

const ItemTypes = {
  IMAGE: 'image',
  COMPONENT: 'component',
  COMPONENT_ADS: 'component_ad',
  COMPONENT_SEP: 'component_sep',
  CONTENT_ITEM: 'content_item',
  CONTENT_ITEM_IMG: 'content_item_img',
  COMPONENT_SPACING: 'content_spacing'
};


// Draggable Image Component
const DraggableImage = ({ id, url }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.IMAGE,
    item: () => {
      console.log(`DraggableImage: Drag Start - ID: ${id}`);
      return { id: id, url: url, type: ItemTypes.IMAGE };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      console.log(`DraggableImage: Drag End - ID: ${id}`);
    }
  }));

  return (
    <div
      ref={drag}
      className="file-item"
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
      }}
    >
      <img
        src={url}
        alt={`uploaded-image-${id}`}
        className="file-item-image"
      />
    </div>
  );
};

// Draggable Component Box
const DraggableComponent = ({name, type }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.COMPONENT,
    item: () => {
      const componentId = Date.now();
      console.log(`DraggableComponent: Drag Start - Type: ${type}, ID: ${componentId}`);
      return { type: type, componentType: type, id: componentId };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      console.log(`DraggableComponent: Drag End - Type: ${type}`);
    }
  }));

  return (
    <div
      ref={drag}
      className="component-box"
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
      }}
    >
      {name}
    </div>
  );
};

// Content Item - finally fixed drag and drop reordering T-T!
const ContentItem = ({ item, index, moveContentItem }) => {
  const ref = useRef(null);
  const [{ handlerId }, drop] = useDrop({
    accept: [ItemTypes.CONTENT_ITEM, ItemTypes.COMPONENT_ADS, ItemTypes.COMPONENT_SEP, ItemTypes.COMPONENT_SPACING, ItemTypes.CONTENT_ITEM_IMG],
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(draggedItem, monitor) {
      if (!ref.current) {
        return;
      }

      const dragIndex = draggedItem.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;


      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      moveContentItem(draggedItem.id, hoverIndex);

      draggedItem.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CONTENT_ITEM,
    item: () => {
      console.log(`ContentItem: Drag Start - ID: ${item.id}, Index: ${index}`);
      return { ...item, index: index, id: item.id };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      console.log(`ContentItem: Drag End - ID: ${item.id}, Index: ${index}`);
    }
  });

  const opacity = isDragging ? 0.5 : 1;
  drag(drop(ref));

  const renderItemContent = () => {
    if (item.type === ItemTypes.IMAGE) {
      return <img src={item.url} alt="content-image" className="content-image" />;

    } else if (item.type === ItemTypes.CONTENT_ITEM_IMG) {
      return <img src={item.url} alt="content-image" className="content-image" />;
    } else if (item.componentType === ItemTypes.COMPONENT_ADS) {
      return <div className="content-placeholder ads-component">This is Ads</div>;
    } else if (item.componentType === ItemTypes.COMPONENT_SEP) {
      return <div className="content-placeholder separator-component"><hr /></div>;
    }
    else if (item.componentType === ItemTypes.COMPONENT_SPACING) {
      return <div className="content-placeholder spacing-component"></div>;
    }
    return null;
  };

  return (
    <div
      ref={ref}
      className="content-item-wrapper"
      style={{
        opacity,
        cursor: 'move',
      }}
      data-handler-id={handlerId}
    >
      <div className="content-item">
        {renderItemContent()}
      </div>
    </div>
  );
};

function ComicEditor() {
  const { chapterId } = useParams()
  const [uploadedImages, setUploadedImages] = useState([]);
  const [contentItems, setContentItems] = useState([]);
  const [isAutoAddModalOpen, setIsAutoAddModalOpen] = useState(false);
  const [autoAddImages, setAutoAddImages] = useState([]);
  const [isTrashHovering, setIsTrashHovering] = useState(false);
  const [activeView, setActiveView] = useState("mobile_view");
  const [chapterData, setChapterData] = useState({})
  const [cookie] = useCookies(['accessToken'])
  const [saveButtonText, setSaveButtonText] = useState('Save');
  const [publishButtonText, setPublishButtonText] = useState('Publish'); 
  const [requireSave, setRequireSave] = useState(false);

  // const [scrollDown, setScrollDown]
  const viewportRef = useRef(null);

  const uploadContentToServer = async () => {
    if (!requireSave) {
      alert("Nothing to save.");
      return;
    }
  
    try {
      let imageUploader = new FormData();
      console.log(uploadedImages);
  
      if (contentItems && contentItems.length > 0) {
        contentItems.forEach((e, ind) => {
          console.log("Prepare:", e.id);
  
          let imageBuffer = Buffer.from(e.url.split(",")[1], "base64");
          let imageType = e.url.substring(e.url.indexOf("/") + 1, e.url.indexOf(";"));
          let fileName = `${e.id}.${imageType}`;
  
          let imageBlob = new Blob([imageBuffer], { type: `image/${imageType}` });
          console.log("Image name:", fileName);
  
          imageUploader.append(`image${ind}`, imageBlob, fileName);
        });
  
        console.log(imageUploader);
  
        const response = await chapterApi.saveComicImage(chapterId, cookie.accessToken, imageUploader);
        console.log(response);
        if(response.status == 200){
          setRequireSave(false)
          setSaveButtonText("Saved!")
        }else{
          setSaveButtonText("Error!")
        }
        setTimeout(()=>{
          setSaveButtonText("Save")
        }, 3000)

      } else {
        console.error("contentItems is empty or undefined.");
      }
    } catch (err) {
      console.error("Error uploading files:", err);
    }
  };
  

  const loadMetadata = async () => {
    // console.log("Got access token:", cookie.accessToken)
    const response = await chapterApi.getChapterDetail(chapterId, cookie.accessToken)
    console.log(response)
    setChapterData(response.data);
  }
  useEffect(()=>{
    console.log(contentItems)
    if(!requireSave && contentItems.length != 0)
    {
      setRequireSave(true)
      console.log("Save enable")
    }
  }, 
  [contentItems])
  useEffect(() => {
    loadMetadata()
  }, [])
  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const newImages = [];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const blob = new Blob([reader.result], { type: file.type });
        const blobUrl = URL.createObjectURL(blob);
        newImages.push({ url: blobUrl, name: file.name });
        if (newImages.length === files.length) {
          setUploadedImages(prevImages => [...prevImages, ...newImages]);
        }
      };
      reader.readAsArrayBuffer(file);
    });
  };

  const handleFolderUpload = (event) => {
    const files = Array.from(event.target.files);

    const imageFiles = files.filter(file =>
      file.name.toLowerCase().endsWith('.heic') ||
      file.name.toLowerCase().endsWith('.png') ||
      file.name.toLowerCase().endsWith('.jpg') ||
      file.name.toLowerCase().endsWith('.jpeg')
    )
    if (imageFiles.length === 0) {
      alert("No image files found in the folder.");
      return;
    }

    const numericalImages = imageFiles.every(file => /^\d+\..*$/.test(file.name));

    if (numericalImages) {
      setAutoAddImages(imageFiles.sort((a, b) => {
        const numA = parseInt(a.name.match(/^(\d+)\./)[1]);
        const numB = parseInt(b.name.match(/^(\d+)\./)[1]);
        return numA - numB;
      }));
      setIsAutoAddModalOpen(true);
    } else {
      alert("Image folder is not format correctly, you must edit by yourself.")
      processFolderImages(imageFiles);
    }
  };

  const processFolderImages = (files) => {
    const newImages = [];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const blob = new Blob([reader.result], { type: file.type });
        const blobUrl = URL.createObjectURL(blob);
        newImages.push({ url: blobUrl, name: file.name });
        if (newImages.length === files.length) {
          setUploadedImages(prevImages => [...prevImages, ...newImages]);
        }
      };
      reader.readAsArrayBuffer(file);
    });
  };


  const confirmAutoAdd = async () => {
    const newImages = await Promise.all(
      autoAddImages.map(file => new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve({ url: reader.result, id: Date.now() +  Math.round(9999 * Math.random()) });
        reader.readAsDataURL(file);
      }))
    );

    setContentItems(prevState => [
      ...prevState,
      ...newImages.map(img => ({
        type: ItemTypes.CONTENT_ITEM_IMG,
        url: img.url,
        id: img.id,
      }))
    ]);

    setIsAutoAddModalOpen(false);
    setAutoAddImages([]);
  };

  const cancelAutoAdd = () => {
    processFolderImages(autoAddImages);
    setIsAutoAddModalOpen(false);
    setAutoAddImages([]);
  };


  const handleDrop = useCallback((acceptedItems) => {
    console.log(`ViewportDropZone: handleDrop - Item Type:`, acceptedItems);
    setContentItems(prevState => {
      const updatedItems = [...prevState];
      let newContentItems;
      if (acceptedItems.type === ItemTypes.IMAGE) {
        newContentItems = [...updatedItems, { type: ItemTypes.CONTENT_ITEM_IMG, url: acceptedItems.url, id: Date.now() }];
      } else if (acceptedItems.type === ItemTypes.COMPONENT) {
        newContentItems = [...updatedItems, { type: acceptedItems.type, componentType: acceptedItems.componentType, id: acceptedItems.id, name: acceptedItems.name }];
      } else if (acceptedItems.type === ItemTypes.COMPONENT_ADS) {
        newContentItems = [...updatedItems, { type: acceptedItems.type, componentType: acceptedItems.componentType, id: acceptedItems.id, name: acceptedItems.name }];
      } else if (acceptedItems.type === ItemTypes.COMPONENT_SEP) {
        newContentItems = [...updatedItems, { type: acceptedItems.type, componentType: acceptedItems.componentType, id: acceptedItems.id, name: acceptedItems.name }];
      } else if (acceptedItems.type === ItemTypes.COMPONENT_SPACING) {
        newContentItems = [...updatedItems, { type: acceptedItems.type, componentType: acceptedItems.componentType, id: acceptedItems.id, name: acceptedItems.name }];
      }
      else {
        newContentItems = updatedItems;
      }
      if (contentItems.length > 0 && viewportRef.current) {
        // Scroll to the bottom after a new item is added
        const lastContentItem = viewportRef.current.lastElementChild;
        if (lastContentItem) {
          lastContentItem.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
      }
      console.log("contentItems after handleDrop:", newContentItems);
      return newContentItems;
    });

  }, []);


  const moveContentItem = useCallback((draggedId, hoverIndex) => {
    console.log(`moveContentItem: Move - ID: ${draggedId}, To: ${hoverIndex}`);

    setContentItems(prevState => {
      console.log("moveContentItem: Prev state:", prevState);
      const currentContentItems = [...prevState];
      const draggedIndex = currentContentItems.findIndex(item => item.id === draggedId);

      if (draggedIndex === -1) {
        console.log("moveContentItem: Dragged item NOT found!");
        return prevState;
      }

      const itemToMove = currentContentItems[draggedIndex];
      currentContentItems.splice(draggedIndex, 1);
      currentContentItems.splice(hoverIndex, 0, itemToMove);

      console.log("moveContentItem: New contentItems:", currentContentItems);
      return currentContentItems;
    });
  }, []);

  const removeContentItem = useCallback((indexToRemove) => {
    console.log(`removeContentItem: Remove - Index: ${indexToRemove}`);
    setContentItems(prevState => {
      const currentViewItems = [...prevState];
      const updatedViewItems = currentViewItems.filter((_, index) => index !== indexToRemove);
      console.log("contentItems after remove:", updatedViewItems);
      return updatedViewItems;
    });
  }, []);


  const ViewportDropZone = ({ children }) => {

    // const handleScroll = useCallback((direction) => {
    //   if (!viewportRef.current) return;

    //   const scrollSpeed = 10;
    //   const scrollAmount = direction === 'down' ? scrollSpeed : -scrollSpeed;

    //   viewportRef.current.scrollTop += scrollAmount;
    // }, [viewportRef]);
    // const handleScroll = () =>{

    // }


    const [collectedProps, trashDrop] = useDrop(() => ({
      accept: [ItemTypes.IMAGE, ItemTypes.COMPONENT, ItemTypes.CONTENT_ITEM, ItemTypes.COMPONENT_ADS, ItemTypes.COMPONENT_SEP, ItemTypes.COMPONENT_SPACING],
      drop: (item, monitor) => {
        console.log(`ViewportDropZone: Drop on Trash - Item Type: ${item.type}, Index: ${item.index}`);
        // if (item.type === ItemTypes.CONTENT_ITEM) {
        removeContentItem(item.index);
        return { type: 'trash' };
        // }
        // return { type: 'trash' };
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
        itemType: monitor.getItemType(),
        isOverTrash: monitor.isOver({
          selector: '.trash-can',
        }),
      }),
      hover: (item, monitor) => {
        setIsTrashHovering(monitor.isOver({
          selector: '.trash-can',
        }));
      },
    }));


    const [collectedPropsViewport, viewportDrop] = useDrop(() => ({
      accept: [ItemTypes.IMAGE, ItemTypes.COMPONENT, ItemTypes.CONTENT_ITEM, ItemTypes.COMPONENT_ADS, ItemTypes.COMPONENT_SEP, ItemTypes.COMPONENT_SPACING],
      drop: (item, monitor) => {
        if ([ItemTypes.IMAGE, ItemTypes.COMPONENT, ItemTypes.COMPONENT_ADS, ItemTypes.COMPONENT_SEP, ItemTypes.COMPONENT_SPACING].includes(item.type)) {
          handleDrop(item);
          console.log(`ViewportDropZone: Drop - Adding New Item: ${item.type}`);
        } else if (item.type === ItemTypes.CONTENT_ITEM || item.type === ItemTypes.CONTENT_ITEM_IMG) {
          console.log(`ViewportDropZone: Drop - Reordering Content Item: ${item.type}`);
          return { type: 'viewport' };
        }
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
        itemType: monitor.getItemType(),
      }),
    }));

    useEffect(() => {
      if (contentItems.length > 0 && viewportRef.current) {
        // Scroll to the bottom after a new item is added
        // const lastContentItem = viewportRef.current.lastElementChild;
        // if (lastContentItem) {
        //   lastContentItem.scrollIntoView({ behavior: 'smooth', block: 'end' });
        // }
      }
    }, [contentItems]);


    return (

      <div className={`viewport-wrapper ${activeView}-wrapper`}>

        <div ref={viewportDrop} className={`view-panel ${activeView}`} style={{ overflowY: 'auto', display: 'flex', justifyContent: 'center' }}>
          <div className="canvas-content">
            <div className={`content-grid`} ref={viewportRef}>
              {contentItems.map((item, index) => renderContentItem(item, index))}
            </div>
          </div>

        </div>
        <div ref={trashDrop}
          className="trash-can"
        >
          🗑️
        </div>
      </div>

    );
  };


  const renderContentItem = (item, index) => (
    <ContentItem
      key={item.id}
      item={item}
      index={index}
      moveContentItem={moveContentItem}
    />
  );


  return (
    <DndProvider backend={HTML5Backend}>
      <div className="pageContainer">
        <Header pageTitle="Comic Editor tool (BETA).">
          {chapterData.chapterTitle ? chapterData.chapterTitle + (requireSave ? " (unsaved)" : " (saved)") : "Loading..."}
        </Header>
        <div className='ComicEditorContainer'>
          <div className="ComponentBar HoverContainer">
            <div className="file-upload-section">
              <div className="FileView">
                <div className="file-grid">
                  {uploadedImages.map((image, index) => (
                    <DraggableImage key={index} id={index} url={image.url} />
                  ))}
                </div>
              </div>
              <div className="FileUpload">
                <button onClick={() => document.getElementById('folderUpload').click()}>Upload Folder</button>
                <input type="file" id="folderUpload" webkitdirectory="true" directory="true" style={{ display: 'none' }} onChange={handleFolderUpload} />
                <button onClick={() => document.getElementById('imageUpload').click()}>Upload Image</button>
                <input type="file" id="imageUpload" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} multiple />
              </div>
            </div>
          </div>

          <div className="ViewportContainer">
            <div className="tabSelect">
              <button className={activeView === "mobile_view" ? 'active' : ''} onClick={() => setActiveView("mobile_view")}>Mobile view</button>
              <button className={activeView === "desktop_view" ? 'active' : ''} onClick={() => setActiveView("desktop_view")}>Desktop view</button>
            </div>

            <ViewportDropZone />

          </div>

          <div className="Properties HoverContainer">
            <div className="ComponentViews">
              {/* <DraggableComponent disabled name="Ads" type={ItemTypes.COMPONENT_ADS} />
              <DraggableComponent disabled name="Seperator" type={ItemTypes.COMPONENT_SEP} />
              <DraggableComponent disabled name="Spacing" type={ItemTypes.COMPONENT_SPACING} /> */}
              <p>Component not supported in this version.</p>
            </div>
            <p>Publish status: {chapterData.relased ? "yes" : "no"}</p>
            <div className="ProceedButton">
              <button onClick={()=>{uploadContentToServer()}}>  {saveButtonText}</button>

              <button>  {publishButtonText}</button>
            </div>
          </div>
        </div>

        {isAutoAddModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <p>Images in the uploaded folder are numerically named. Do you want to automatically add them to the screen in order?</p>
              <div className="modal-buttons">
                <button onClick={confirmAutoAdd}>Yes, Automatically Add</button>
                <button onClick={cancelAutoAdd}>No, Just Upload</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DndProvider>
  )
}
export default ComicEditor;