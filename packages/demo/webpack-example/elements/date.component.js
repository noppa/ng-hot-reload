class DateComponentController {

}

Object.assign(DateComponentController, {
  controller: DateComponentController,
  template: `
    <label>
    {{$ctrl.label}}
    <input type="date" />
    </label>
  `,
  bindings: {
    label: '@',
  },
});

export default DateComponentController;
