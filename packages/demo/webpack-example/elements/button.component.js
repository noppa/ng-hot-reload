
class ButtonComponentController {

}

Object.assign(ButtonComponentController, {
  controller: ButtonComponentController,
  template: `
    <button type="button">{{$ctrl.label}}!</button>
  `,
  bindings: {
    label: '@',
  },
});

export default ButtonComponentController;
