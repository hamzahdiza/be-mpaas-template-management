Component({
  mixins: [],
  data: {},
  props: {
    visible : String(""),
    position : String(""),
    animation : String(""),
    onClose : Function,
    type: String("default"),
    pageStyle: String(""),
    pageClass: String("")
  },
  didMount() {},
  didUpdate() {},
  didUnmount() {},
  methods: {
    onClose() {
      this.props.onClose()
    }
  },
});
