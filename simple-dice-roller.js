class SimpleDiceRoller {

    static async Init(controls, html) {

        console.log("Init called!");

        const diceRollbtn = $(
            `
            <li class="scene-control sdr-scene-control" data-control="simple-dice-roller" title="SWADE Dice Roller">
                <i class="fas fa-dice-d20"></i>
            
                <ol class="control-tools">
                    <div id="SDRpopup" class="simple-dice-roller-popup" style="display: none;">
                        <ul>
                            <li data-dice-type="4" data-dice-roll="1" class="sdr-col1"><i class="df-d4-4" data-dice-type="4" data-dice-roll="1"></i> d4</li>
                            <li data-dice-type="4" data-dice-roll="2">2</li>
                            <li data-dice-type="4" data-dice-roll="3">3</li>
                            <li data-dice-type="4" data-dice-roll="1" data-wild="true">1w</li>
                            <li data-dice-type="4" data-dice-roll="2" data-wild="true">2w</li>
                            <li data-dice-type="4" data-dice-roll="3" data-wild="true" class="sdr-lastcol">3w</li>
                        </ul>
                        <ul>
                            <li data-dice-type="6" data-dice-roll="1" class="sdr-col1"><i class="df-d6-6" data-dice-type="6" data-dice-roll="1"></i> d6</li>
                            <li data-dice-type="6" data-dice-roll="2">2</li>
                            <li data-dice-type="6" data-dice-roll="3">3</li>
                            <li data-dice-type="6" data-dice-roll="1" data-wild="true">1w</li>
                            <li data-dice-type="6" data-dice-roll="2" class="sdr-lastcol" data-wild="true">2w</li>
                        </ul>
                        <ul>
                            <li data-dice-type="8" data-dice-roll="1" class="sdr-col1"><i class="df-d8-8" data-dice-type="8" data-dice-roll="1"></i> d8</li>
                            <li data-dice-type="8" data-dice-roll="2">2</li>
                            <li data-dice-type="8" data-dice-roll="3">3</li>
                            <li data-dice-type="8" data-dice-roll="1" data-wild="true">1w</li>
                            <li data-dice-type="8" data-dice-roll="2" class="sdr-lastcol" data-wild="true">2w</li>
                        </ul>
                        <ul>
                            <li data-dice-type="10" data-dice-roll="1" class="sdr-col1"><i class="df-d10-10" data-dice-type="10" data-dice-roll="1"></i> d10</li>
                            <li data-dice-type="10" data-dice-roll="2">2</li>
                            <li data-dice-type="10" data-dice-roll="3">3</li>
                            <li data-dice-type="10" data-dice-roll="1" data-wild="true">1w</li>
                            <li data-dice-type="10" data-dice-roll="2" class="sdr-lastcol" data-wild="true">2w</li>
                        </ul>
                        <ul>
                            <li data-dice-type="12" data-dice-roll="1" class="sdr-col1"><i class="df-d12-12" data-dice-type="12" data-dice-roll="1"></i> d12</li>
                            <li data-dice-type="12" data-dice-roll="2">2</li>
                            <li data-dice-type="12" data-dice-roll="3">3</li>
                            <li data-dice-type="12" data-dice-roll="1" data-wild="true">1w</li>
                            <li data-dice-type="12" data-dice-roll="2" class="sdr-lastcol" data-wild="true">2w</li>
                        </ul>
                        <ul>
                            <li data-dice-type="20" data-dice-roll="1" class="sdr-col1"><i class="df-d20-20" data-dice-type="20" data-dice-roll="1"></i> d20</li>
                            <li data-dice-type="20" data-dice-roll="2">2</li>
                            <li data-dice-type="20" data-dice-roll="3">3</li>
                            <li data-dice-type="20" data-dice-roll="1" data-wild="true">1w</li>
                            <li data-dice-type="20" data-dice-roll="2" class="sdr-lastcol" data-wild="true">2w</li>
                        </ul>
                        <ul class="sdr-lastrow">
                            <li data-dice-type="100" data-dice-roll="1" class="sdr-col1"><i class="df-d10-10" data-dice-type="100" data-dice-roll="1"></i><i class="df-d10-10" data-dice-type="100" data-dice-roll="1"></i> d100</li>
                            <li data-dice-type="100" data-dice-roll="2">2</li>
                            <li data-dice-type="100" data-dice-roll="3">3</li>
                            <li data-dice-type="100" data-dice-roll="1" data-wild="true">1w</li>
                            <li data-dice-type="100" data-dice-roll="2" class="sdr-lastcol" data-wild="true">2w</li>
                        </ul>
                    </div>
                </ol>
            </li>
            `
        );

        html.append(diceRollbtn);

        html.find('.simple-dice-roller-popup li').click(ev => this._rollDice(ev, html));

        diceRollbtn[0].addEventListener('click', ev => this.PopupSheet(ev, html));

    }

    static async _rollDice(event, html) {

        var diceType = event.target.dataset.diceType;
        var diceRoll = event.target.dataset.diceRoll;
        var wild = event.target.dataset.wild;

        if(wild === "true"){
            
            var formula = "{";

            for(var i = 0; i < diceRoll; ++i){
                formula += "1d" + diceType + "x=";
                if(i < diceRoll - 1)
                    formula += ", "
            }

            console.log("used " + formula + "}dl");

            let r = new Roll(formula + "}dl");

            r.toMessage({
              type: CONST.CHAT_MESSAGE_TYPES.ROLL,
              content: r.results,
              user: game.user._id,
              sound: CONFIG.sounds.dice,
            });

        }
        else{
            var formula = diceRoll + "d" + diceType;

            let r = new Roll(formula);

            r.toMessage({
                user: game.user._id,
            })
        }

        this._close(event, html);

    }
    
    static async PopupSheet(event, html) {
        //console.log("SDR | clicked");

        if (html.find('.sdr-scene-control').hasClass('active')) {
            this._close(event, html);
        } else {
            this._open(event, html);
        }
    }

    static async _close(event, html) {
        //console.log("SDR | closed");
        html.find('#SDRpopup').hide();
        html.find('.sdr-scene-control').removeClass('active');
        html.find('.scene-control').first().addClass('active');
        event.stopPropagation();
    }

    static async _open(event, html) {
        //console.log("SDR | opened");
        html.find('.scene-control').removeClass('active');
        html.find('#SDRpopup').show();
        html.find('.sdr-scene-control').addClass('active');
        event.stopPropagation();
    }


}

Hooks.on('renderSceneControls', (controls, html) => { SimpleDiceRoller.Init(controls, html); });

console.log("SDR | Simple Dice Roller loaded");