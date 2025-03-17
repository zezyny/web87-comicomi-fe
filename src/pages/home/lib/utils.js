// Simple utility functions

// Join classnames
export function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

// Format date
export function formatDate(date) {
  return new Date(date).toLocaleDateString()
}

// Format number with k for thousands
export function formatNumber(num) {
  return num >= 1000 ? `${(num / 1000).toFixed(1)}k` : num
}

