"use strict";$(function(){var t=$('input[type="file"]'),i=$(".file-path");t.on("change",function(){var t=$(this).val().split("fakepath\\")[1];i.text(t)})});