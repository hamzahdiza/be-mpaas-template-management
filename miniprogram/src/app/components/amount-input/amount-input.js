Component({
  data: {
    originalValue: [],
    timeId: 0,
    timeId2: 1,
    maxLength: 12,
    showCopy: false,
    lang: ""
  },
  ref() {
    return {
      changeOrginValue: (value) => this.changeOrginValue(value),
      closePopover: (value) => this.closePopover(value),
    };
  },
  props: {
    disabled: false,
    type: "RP",
    onCopy: Function,
    onPaste: Function,
    inputValue: "",
    onClear: Function,
    onFocus: Function,
    isFocus: false,
    scrollPosition: 0,
    error: false,
    caption: "",
    showKeybord: false,
    onChange: Function,
    onClose: Function,
    onLongTap: Function,
    keyboardButtonText: String(""),
  },
  onInit() {
    this.setData({
      originalValue: [],
      lang: getApp().globalData.languagePack
    });
  },
  methods: {
    onHandleClick(e) {
      this.setData({
        showCopy: false,
      });
      clearTimeout(this.data.timeId);
      this.data.timeId = setTimeout(() => {
        if (this.data.originalValue && this.data.originalValue.length === 0) {
          if (e.target.dataset.attr === ".") {
            let newInputValue = this.props.inputValue + ".";
            this.data.originalValue.push("0");
            this.data.originalValue.push(".");
            this.props.onChange(newInputValue, this.data.originalValue);
          } else if (e.target.dataset.attr === "000") {
            return
          } else if (e.target.dataset.attr === "0") {
            return
          } else {
            this.setChange(e);
          }
        } else if (this.data.originalValue.length === 1) {
          if (this.data.originalValue[0] === "0" && e.target.dataset.attr !== ".") {
            let attr = e.target.dataset.attr === "000" ? "0" : e.target.dataset.attr;
            this.setData({
              originalValue: [attr],
            });
            let newInputValue = attr;
            this.props.onChange(newInputValue, this.data.originalValue);
          } else {
            this.setChange(e);
          }
        } else if (this.data.originalValue.length > 1) {
          if (
            this.data.originalValue.indexOf(".") === -1 &&
            ((e.target.dataset.attr !== "." &&
                this.data.originalValue.length < this.data.maxLength) ||
              e.target.dataset.attr === ".")
          ) {
            this.setChange(e);
          } else if (
            e.target.dataset.attr !== "." &&
            this.data.originalValue.length - this.data.originalValue.indexOf(".") <= 2
          ) {
            this.setChange(e);
          }
        }
      }, 50);
    },
    setChange(e) {
      let attr = "";
      if (e.target.dataset.attr === "000") {
        if (this.data.maxLength - this.data.originalValue.length >= 3) {
          for (let i = 0; i < 3; i++) {
            this.data.originalValue.push("0");
            attr = attr + "0";
          }
        } else {
          for (let i = 0; i < this.data.maxLength - this.data.originalValue.length; i++) {
            this.data.originalValue.push("0");
            attr = attr + "0";
          }
        }
      } else {
        this.data.originalValue.push(e.target.dataset.attr);
        attr = e.target.dataset.attr;
      }
      let newInputValue = this.props.inputValue + attr;
      this.props.onChange(newInputValue, this.data.originalValue);
    },
    onHandleClickDelete() {
      this.setData({
        showCopy: false,
      });
      clearTimeout(this.data.timeId);
      this.data.timeId = setTimeout(() => {
        const deleteOriginalValue = this.data.originalValue.slice(
          0,
          this.data.originalValue.length - 1
        );
        this.props.onChange(deleteOriginalValue.toString().replace(/\,/g, ""), deleteOriginalValue);  // eslint-disable-line
        this.setData({
          originalValue: deleteOriginalValue,
        });
      }, 50);
    },
    handlePopupClose() {
      this.setData({
        showCopy: false,
      });
      this.props.onClose();
    },
    onLongTap() {
      if(!this.props.disabled) {
        this.setData({
          showCopy: true,
        });
      }
    },
    onCopy() {
      this.props.onCopy();
    },
    onPaste() {
      this.props.onPaste();
    },
    changeOrginValue(value) {
      this.setData({
        originalValue: value,
        showCopy: false,
      });
    },
    closePopover(value) {
      if (!this.props.disabled) {
        this.setData({
          showCopy: value,
        });
      }
    },
  },
});