Component({
  data: {},
  props: {
    onUpdateQuestionInfo: () => {},
  },
  methods: {
    selectOption(e) {
      // 获取Option定位
      const index = e.currentTarget.dataset.index
      this.props.onUpdateQuestionInfo(my.questionnaireInfo.current, index)
    }
  }
})