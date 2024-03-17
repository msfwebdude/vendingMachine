class VendingMachine {
  constructor (){
    // variables
    this.balance              = 0
    this.animationRunning     = false
    this.timerIdleAnimation   = self.setInterval(() => { this.checkIdleTime() }, 1000)
    this.lastTimeSinceHover   = new Date()
    this.audioObject          = null
    this.animationInformation = {
      startId       : 1,
      endId         : 5,
      timerObject   : null,
      animationIndex: null
    }


    // constants
    this.ANIMATION_DELAY_STEP      = 500
    this.IDLE_ANIMATION_SECONDS    = 7
    this.TOAST_MESSAGE_DISPLAY_MS  = 3000
    this.RETURN_CHANGE_ON_PURCHASE = true
  }

  addCoin(value) {
    
    this.resetIdle()

    //add balance
    this.balance += value

    if (this.balance > 1000) {
      this.prepSound();
      this.playSound('overflow');
      this.giveChange(this.balance - 1000)
    }
    else {
      //redraw balance
      self.display2.innerHTML = `${this.balance}`
      this.prepSound();
      this.playSound('coin');
    }
  }

  returnAll() {
    if (this.balance > 0) {
      this.prepSound();
      this.playSound('change');

      this.giveChange(this.balance)
    }
  }

  clearCoinReturn() {
    self.tray1.innerHTML=`Coin Return<p></p><span id="trayCoins"></span>`
  }

  giveChange(value) {
    var currentValue = parseInt(value)

    // process 500 value coins
    while (currentValue >= 500) {
      currentValue -= 500

      //remove balance
      this.balance -= 500

      //redraw balance
      self.trayCoins.innerHTML += `<div class="coin" style="cursor: default;">500</div>`
      self.display2.innerHTML = `${this.balance}`
    }

    // process 100 value coins
    while (currentValue >= 100) {
      currentValue -= 100

      //remove balance
      this.balance -= 100

      //redraw balance
      self.trayCoins.innerHTML += `<div class="coin" style="cursor: default;">100</div>`
      self.display2.innerHTML = `${this.balance}`
    }

    // process 50 value coins
    while (currentValue >= 50) {
      currentValue -= 50

      //remove balance
      this.balance -= 50

      //redraw balance
      self.trayCoins.innerHTML += `<div class="coin" style="cursor: default;">50</div>`
      self.display2.innerHTML = `${this.balance}`
    }

    // process 10 value coins
    while (currentValue >= 10) {
      currentValue -= 10

      //remove balance
      this.balance -= 10

      //redraw balance
      self.trayCoins.innerHTML += `<div class="coin" style="cursor: default;">10</div>`
      self.display2.innerHTML = `${this.balance}`
    }

    self.display2.innerHTML = `${this.balance}`
       
  }
  
  resetIdle() {
    this.lastTimeSinceButtonMouseover = new Date()
    if (this.animationRunning) this.stopAnimation()
  }

  checkIdleTime() {
    var now = new Date()
    if ( ((now - this.lastTimeSinceHover) / 1000) > this.IDLE_ANIMATION_SECONDS && !this.animationRunning) {
      this.lastTimeSinceHover = new Date()
      this.startAnimation()
    }
  }

  startAnimation() {
    this.animationRunning = true
    // set step interval
    this.animationInformation.timerObject = setInterval(() => { this.stepAnimation() }, this.ANIMATION_DELAY_STEP)
  }
  
  stepAnimation() {
    if (this.animationRunning) {
      this.animationInformation.animationIndex++;
      if (this.animationInformation.animationIndex > this.animationInformation.endId) this.animationInformation.animationIndex = this.animationInformation.startId
      
      for (let i = 1; i < this.animationInformation.endId + 1; i++) {
        this.resetButtonState(self[`itemButton${i}`])
        if (this.animationInformation.animationIndex == i) self[`itemButton${i}`].style.backgroundImage = `url('./assets/img/button-hover.png')`
      }
    }
  }

  stopAnimation() {
    this.animationRunning = false
    if (this.animationInformation.timerObject) clearInterval(this.animationInformation.timerObject)
    this.animationInformation.animationIndex = this.animationInformation.startId

    // clear all lights
    for (let i = 1; i < this.animationInformation.endId + 1; i++) {
      this.resetButtonState(self[`itemButton${i}`])
    }
  }

  resetButtonState(button) {
    button.style = ""
  }

  buy(button) {
    this.prepSound();

    var price = null
    var photo = null

    var siblings = button.parentElement.childNodes

    for (var sibling of siblings) {
      if (sibling.nodeName == 'LABEL') price = Number(`${sibling.innerHTML}`.replace(/[^0-9]/g, ''))
      if (sibling.nodeName == 'IMG')   photo = sibling.src
    }

    if (price > this.balance) {
      self.display2.innerHTML = `${price}`;
      self.setTimeout(() => { self.display2.innerHTML = `${this.balance}` }, 500)
    }
    else {
      this.balance -= price;
      if (this.RETURN_CHANGE_ON_PURCHASE) {
        if (this.balance > 0) {
          this.prepSound();
          this.playSound('dispenseAndChange');          
        }
        else {
          this.prepSound();
          this.playSound('dispense');
        }
        this.giveChange(this.balance)
      }
      else {
        this.prepSound();
        this.playSound('dispense');
      }
      
      self.toastProduct.src = `${photo}`
      self.toast.className  = `toastShow`
      self.setTimeout(() => { self.toast.className = `toastHide` }, this.TOAST_MESSAGE_DISPLAY_MS)
    }
  }

  prepSound() {
    if (!this.audioObject) this.audioObject = new Audio('./assets/audio/vending.wav')
  }

  playSound(soundName) {
    switch (soundName) {
      case 'coin':
        this.audioObject.currentTime = 0.916
        self.setTimeout(() => { this.audioObject.pause() }, 1054)
        this.audioObject.play()
        break;

      case 'dispense':
        this.audioObject.currentTime = 3.000
        self.setTimeout(() => { this.audioObject.pause() }, 2000)
        this.audioObject.play()
        break;

      case 'change':
        this.audioObject.currentTime = 5.000
        self.setTimeout(() => { this.audioObject.pause() }, 2000)
        this.audioObject.play()
        break;

      case 'dispenseAndChange':
        this.audioObject.currentTime = 3.000
        self.setTimeout(() => { this.audioObject.pause() }, 4000)
        this.audioObject.play()
        break;
        
      case 'overflow':
        this.audioObject.currentTime = 0.916
        self.setTimeout(
          () => { 
            this.audioObject.pause() 
            
            this.audioObject.currentTime = 5.000
            self.setTimeout(() => { this.audioObject.pause() }, 2000)
            this.audioObject.play()
          }, 
          1054
        );
        this.audioObject.play()
        break;
  
      default:
        break;
    }
  }


}

var vendingMachine = new VendingMachine()


document.addEventListener(
  "DOMContentLoaded", 
  (e) => {
    // set dynamic content
    const dateCurrent = new Date();
    const dateUpdated = new Date(self.DateUpdated.innerHTML);
    self.currentYear.innerHTML = dateCurrent.getFullYear();
    self.DateUpdated.innerHTML = dateUpdated.toLocaleString().replace(',', '');
    if(!(dateUpdated instanceof Date && isFinite(dateUpdated))) {
        self.DateUpdated.innerHTML = "unknown";
    }
  }
);
