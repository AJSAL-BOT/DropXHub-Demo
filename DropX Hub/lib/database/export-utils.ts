import type { AppType, AppStoreSettings } from "@/lib/types"

// Function to convert data to JavaScript code
export const convertDataToCode = (data: {
  apps: AppType[]
  settings: AppStoreSettings
}) => {
  // Format the apps array as JavaScript code
  const appsCode = `export const apps: AppType[] = ${JSON.stringify(data.apps, null, 2)}`

  // Format the settings object as JavaScript code
  const settingsCode = `export const defaultSettings: AppStoreSettings = ${JSON.stringify(data.settings, null, 2)}`

  return {
    appsCode,
    settingsCode,
  }
}

// Function to create a downloadable file with the code
export const downloadCodeAsFile = (code: string, filename: string) => {
  const blob = new Blob([code], { type: "text/javascript" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// Function to copy code to clipboard
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    console.error("Failed to copy text: ", err)
    return false
  }
}
