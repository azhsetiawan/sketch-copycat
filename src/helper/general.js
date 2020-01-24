var sketch = require('sketch/dom')
var UI = require('sketch/ui')

var document = sketch.getSelectedDocument()
var selection = document.selectedLayers

function hasTagged(layer_name) {
  const regex = new RegExp('#copycat-?.+', 'g')
  return regex.test(layer_name)
}

export function checkSelection() {
  if (selection.isEmpty) {
    UI.message("😪 No Artboard is selected")
    return
  }

  if (selection.length > 1) {
    UI.message("😡 Select only one, not multiple!")
    return
  }

  if (selection.layers[0].type !== "Artboard") {
    UI.message("😡 Select Artboard only!")
    return
  }

  return true
}

export function checkLastLayerName(last_layer_name) {
  return hasTagged(last_layer_name)
}

export function loadLocalImage(file_abspath) {
  if (!NSFileManager.defaultManager().fileExistsAtPath(file_abspath)) { 
    return null
  }

  return NSImage.alloc().initWithContentsOfFile(file_abspath)
}

export default function() {}