/*
 * Copyright © HatioLab Inc. All rights reserved.
 */

import COMPONENT_IMAGE from "./excel.png";

import { Component, DataSource, RectPath, Shape } from "@hatiolab/things-scene";
import XLSX from "xlsx";

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
    }
  ]
};

async function fetchData(url) {
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
    super.dispose();
  }

  ready() {
    const { src } = this.state;

    if (src) {
      fetchData(src).then(data => {
        this.setState("data", data);
      });
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

  get src() {
    return this._src;
  }

  set src(src) {
    this._src = src;

    if (src) {
      fetchData(src).then(data => {
        this.setState("data", data);
      });
    }
  }
}

Component.register("excel", Excel);
