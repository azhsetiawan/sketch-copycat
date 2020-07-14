import { getScale } from './helper/general'

var sketch = require('sketch/dom')
var UI = require('sketch/ui')
var Settings = require('sketch/settings')

var Dialog = require("./helper/dialog").dialog;
var _ui = require("./helper/dialog").ui;

export default function() {

  var scale = getScale()

  var dialog = new Dialog(
    "Copycat Settings",
    null,
    null,
    ["Save", "Cancel"]
  )

  dialog.addLabel("Image Scale Size:");

  var selectScale = _ui.popupButton(["1x","2x","3x"]);
  dialog.addView(selectScale);

  _ui.selectItemAtIndex_forPopupButton(scale-1,selectScale)

  var responseCode = dialog.run()
  if (responseCode == 1000) {
    var selectedScale = selectScale.indexOfSelectedItem()
    var result = selectedScale+1
    Settings.setSettingForKey('copycat-scale', result)
    UI.message(`✅ Copycat scale is set to "${selectScale.titleOfSelectedItem()}"`)
  }
}