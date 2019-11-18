/*
 * Copyright © HatioLab Inc. All rights reserved.
 */

import COMPONENT_IMAGE from "./excel.png";

import { Component, DataSource, RectPath, Shape } from "@hatiolab/things-scene";
import XLSX from "!xlsx";

const NATURE = {
  mutable: false,
  resizable: true,
  rotatable: true,
  properties: [
    {
      type: "string",
      label: "src",
      name: "src",
      placeholder: "Excel File URL"
    },
    {
      type: "number",
      label: "period",
      name: "period",
      placeholder: "seconds"
    }
  ]
};

async function fetchData(url) {
  if (!url.startsWith("data:")) {
    // prevent read from cache
    if (url.indexOf("?") !== -1) {
      url = url + `&ts=${Date.now()}`;
    } else {
      url = url + `?ts=${Date.now()}`;
    }
  }

  const file = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/xlsx"
    },
    credentials: "include"
  });

  const workbook = XLSX.read(await file.arrayBuffer(), { type: "array" });

  var result = {};
  workbook.SheetNames.forEach(sheet => {
    var roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
    if (roa.length) {
      result[sheet] = roa;
    }
  });

  console.log("result", result);
  return result;
}

export default class Excel extends DataSource(RectPath(Shape)) {
  static get image() {
    if (!Excel._image) {
      Excel._image = new Image();
      Excel._image.src = COMPONENT_IMAGE;
    }

    return Excel._image;
  }

  dispose() {
    this._stopRepeater();
    super.dispose();
  }

  ready() {
    const { src } = this.state;

    if (src) {
      this._initInterval();
    }
  }

  render(context) {
    /*
     * TODO role이 publisher 인지 subscriber 인지에 따라서 구분할 수 있는 표시를 추가할 것.
     */

    var { left, top, width, height } = this.bounds;

    context.beginPath();
    context.drawImage(Excel.image, left, top, width, height);
  }

  get nature() {
    return NATURE;
  }

  _initInterval() {
    this._stopRepeater();
    this._startRepeater();
  }

  _startRepeater() {
    var { src, period } = this.state;
    period = Number(period);

    var fetchable = true;

    if (period && this.app.isViewMode) {
      this.repeatTimer = setInterval(() => {
        fetchable &&
          this.repeatTimer &&
          requestAnimationFrame(() => {
            fetchable = true;
            fetchData(src).then(data => {
              this.setState("data", data);
            });
          });
        fetchable = false;
      }, period * 1000);
    }

    fetchData(src).then(data => {
      this.setState("data", data);
    });
  }

  _stopRepeater() {
    if (this.repeatTimer) clearTimeout(this.repeatTimer);

    delete this.repeatTimer;
  }

  ondropfile(transfered, files) {
    for (let i = 0; i < transfered.length; i++) {
      if (/\.xlsx?$/.test(transfered[i].name)) {
        this.src = files[i];
        return;
      }
    }
  }

  onchange(after, before) {
    if ("period" in after || "src" in after) {
      this._initInterval();
    }
  }
}

Component.register("excel", Excel);
