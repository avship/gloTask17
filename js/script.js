"use strict";

const professions = document.querySelector("#professions");
const addBtn = document.querySelector("#add");

const workFrom = document.querySelector("#workFrom");

const nameInp = document.querySelector("#name");
const surnameInp = document.querySelector("#surname");
const patronymicInp = document.querySelector("#patronymic");
const ageInp = document.querySelector("#age");
const sexInp = document.querySelector("#sex");
const extraField = document.querySelector("#extraField");

const workerAccord = document.querySelector("#workerData");
const locsmithAccord = document.querySelector("#locksmithData");
const driverAccord = document.querySelector("#driverData");
const teacherAccord = document.querySelector("#teacherData");

let tableTemplate = `
<table class="table">
  <thead>
    <tr>
      <th scope="col">id</th>
      <th scope="col">ФИО</th>
      <th scope="col">Возраст</th>
      <th scope="col">Доп. информация</th>
      <th scope="col">Действие</th>
    </tr>
  </thead>
  <tbody>####</tbody>
</table>`;
const fieldToName = {
  name: "Имя",
  surname: "Фамилия",
  patronymic: "Отчество",
  age: "Возраст",
  workFrom: "Работает с",
  sex: "Пол",
  category: "Категория",
  driveCat: "Категория прав",
  rank: "Разряд",
};

class Worker {
  constructor() {
    this._name = null;
    this._surname = null;
    this._patronymic = null;
    this._age = null;
    this._sex = null;
    this._workFrom = null;
  }
  toCopy() {
    return JSON.parse(
      JSON.stringify({
        classname: "Worker",
        name: this._name,
        surname: this._surname,
        patronymic: this._patronymic,
        age: this._age,
        sex: this._sex,
        workFrom: this._workFrom,
      })
    );
  }
  set name(name) {
    if (name === "") {
      return;
    }
    this._name = name;
  }
  set surname(surname) {
    if (surname === "") {
      return;
    }
    this._surname = surname;
  }
  set patronymic(patronymic) {
    if (patronymic === "") {
      return;
    }
    this._patronymic = patronymic;
  }
  set age(age) {
    if (age === "") {
      return;
    }
    this._age = age;
  }
  set sex(sex) {
    if (sex === "") {
      return;
    }
    this._sex = sex;
  }
  set workFrom(workFrom) {
    if (workFrom === "") {
      return;
    }
    this._workFrom = workFrom;
  }
}
//слесарь
class Locksmith extends Worker {
  constructor() {
    super();
    this._rank = null;
  }
  set rank(item) {
    this._rank = item;
  }
  toCopy() {
    return JSON.parse(
      JSON.stringify({
        classname: "Locksmith",
        name: this._name,
        surname: this._surname,
        patronymic: this._patronymic,
        age: this._age,
        sex: this._sex,
        workFrom: this._workFrom,
        rank: this._rank,
      })
    );
  }
}
class Driver extends Worker {
  constructor() {
    super();
    this._driveCat = null;
  }
  set driveCat(item) {
    this._driveCat = item;
  }
  toCopy() {
    return JSON.parse(
      JSON.stringify({
        classname: "Driver",
        name: this._name,
        surname: this._surname,
        patronymic: this._patronymic,
        age: this._age,
        sex: this._sex,
        workFrom: this._workFrom,
      })
    );
  }
}
class Teacher extends Worker {
  constructor() {
    super();
    this._category = null;
  }
  set category(item) {
    this._category = item;
  }
  toCopy() {
    return JSON.parse(
      JSON.stringify({
        classname: "Teacher",
        name: this._name,
        surname: this._surname,
        patronymic: this._patronymic,
        age: this._age,
        sex: this._sex,
        workFrom: this._workFrom,
        category: this._category,
      })
    );
  }
}

class DataWorker {
  constructor() {
    this._localStorageName = "task17data";
    this._data =
      localStorage.getItem(this._localStorageName) === null
        ? []
        : JSON.parse(localStorage.getItem(this._localStorageName));
    console.log(this._data);
  }
  get data() {
    return JSON.parse(JSON.stringify(this._data));
  }
  delElement(id) {
    this._data.splice(id, 1);
  }
  addData() {
    console.log(this._data);
    const data = {
      name: nameInp.value.trim() !== "" ? nameInp.value.trim() : null,
      surname: surnameInp.value.trim() !== "" ? surnameInp.value.trim() : null,
      patronymic:
        patronymicInp.value.trim() !== "" ? patronymicInp.value.trim() : null,
      age:
        String(parseInt(age.value.trim())) === age.value.trim()
          ? parseInt(age.value.trim())
          : null,
      workFrom: workFrom.value.trim().match(/\d{1,2}:\d{1,2}:\d+/)
        ? workFrom.value.trim()
        : null,
    };

    let errors = [];
    for (const field in data) {
      if (data[field] == null) {
        errors.push(fieldToName[field]);
      }
    }
    if (errors.length) {
      alert(`Неправильно заполнены или не заполнены поля: 
    ${errors.join(",")}`);
      return;
    }
    data.sex = sexInp.options[sexInp.selectedIndex].value;

    let myObj = null;
    switch (professions.options[professions.selectedIndex].value) {
      case "w":
        myObj = new Worker();
        break;
      case "l":
        myObj = new Locksmith();
        myObj._rank = extraField.options[extraField.selectedIndex].value;
        break;
      case "d":
        myObj = new Driver();
        myObj._driveCat = extraField.options[extraField.selectedIndex].value;
        break;
      case "t":
        myObj = new Teacher();
        myObj._category = extraField.options[extraField.selectedIndex].value;
        break;
    }
    for (const field in data) {
      myObj[field] = data[field];
    }
    this._data.push({ id: this._data.length, obj: myObj.toCopy() });
    this.saveData();
  }
  saveData() {
    localStorage.setItem(this._localStorageName, JSON.stringify(this._data));
  }
  renderTable(accord, classname) {
    accord.innerHTML = "";
    let workerTable = String(tableTemplate);
    let workerItems = this._data.filter(
      (item) => item.obj.classname === classname
    );
    let result = [];
    for (const item of workerItems) {
      let extraData = [];
      for (const objItemName in item.obj) {
        if (
          objItemName !== "name" &&
          objItemName !== "patronymic" &&
          objItemName !== "surname" &&
          objItemName !== "age" &&
          objItemName !== "classname"
        ) {
          extraData.push(
            `<p>${fieldToName[objItemName]}: ${item.obj[objItemName]}</p>`
          );
        }
      }
      result.push(
        `<tr><td>${item.id}</td><td>${item.obj.name} ${item.obj.patronymic} ${
          item.obj.surname
        }</td><td>${item.obj.age}</td><td>${extraData.join(
          ""
        )}</td><td><button class="btn btn-danger" id="delBtn${
          item.id
        }">Удалить</button></td></tr>`
      );
    }
    workerTable = workerTable.replace("####", result.join(""));
    accord.innerHTML = workerTable;
    //прописываю удаление кнопки
    for (const item of workerItems) {
      document
        .querySelector(`#delBtn${item.id}`)
        .addEventListener("click", function btnRemover(event) {
          const data = dataWorker.data;
          console.log(data);
          for (const i in data) {
            if (data[i].id === item.id) {
              dataWorker.delElement(i);
              break;
            }
          }
          event.target.removeEventListener("click", btnRemover);
          dataWorker.renderTables();
          dataWorker.saveData();
        });
    }
  }
  renderTables() {
    this.renderTable(workerAccord, "Worker");
    this.renderTable(locsmithAccord, "Locksmith");
    this.renderTable(driverAccord, "Driver");
    this.renderTable(teacherAccord, "Teacher");
  }
  renderField() {
    if (professions.options[professions.selectedIndex].value !== "w") {
      let fieldNames = [];
      extraField.innerHTML = "";
      extraField.removeAttribute("disabled");

      switch (professions.options[professions.selectedIndex].value) {
        case "l":
          fieldNames = ["Первый", "Второй", "Третий"];
          break;
        case "d":
          fieldNames = ["A", "B", "C", "D"];
          break;
        case "t":
          fieldNames = ["Без категории", "Первая", "Высшая"];
          break;
      }

      extraField.innerHTML = fieldNames
        .map((item) => {
          return `<option value="${item}">${item}</option>`;
        })
        .join("\n");
    } else {
      extraField.setAttribute("disabled", true);
    }
  }
}

const dataWorker = new DataWorker();

professions.addEventListener("input", dataWorker.renderField);
addBtn.addEventListener("click", function () {
  dataWorker.addData();
  dataWorker.renderTables();
});
document.addEventListener("DOMContentLoaded", () => {
  dataWorker.renderField();
  dataWorker.renderTables();
});
