$(document).ready(function () {
    var game = {
        state: "intro",
        players: [
            {
                name: "Luke Skywalker",
                status: "",
                hp: 140,
                totalHp: 140,
                attackPower: 10,
                attackIncrement: 10,
                counterPower: 24,
                images: {
                    roster: "lukeRoster.jpg",
                    battle: "lukeBattle.jpg",
                    defeat: "lukeDefeat.gif",
                    ready: "lukeReady.gif"
                },
                sounds: {
                    hypeSound: "darthHype.mp3",
                    attackSound: "lukeAttack.mp3",
                    themeSong: "lukeBattle.mp3"
                },
                oneLiner: "Aw geez guys.",
                forceColor: ""
            },
            {
                name: "Darth Maul",
                status: "",
                hp: 135,
                totalHp: 135,
                attackPower: 12,
                attackIncrement: 12,
                counterPower: 25,
                images: {
                    roster: "darthRoster.jpg",
                    battle: "darthBattle.jpg",
                    defeat: "darthDefeat.webp",
                    ready: "darthReady.gif",
                    champion: ""
                },
                sounds: {
                    themeSong: "darthMaulTheme.mp3",
                    hypeSound: "darthHype.mp3",
                    attackSound: "darthAttack.mp3"
                },
                oneLiner: "I'll watch you die.",
                forceColor: ""
            },
            {
                name: "Yoda",
                status: "",
                hp: 120,
                totalHp: 120,
                attackPower: 13,
                attackIncrement: 13,
                counterPower: 30,
                images: {
                    roster: "yodaRoster.jpeg",
                    battle: "yodaBattle.png",
                    defeat: "yodaDefeat.gif",
                    ready: "yodaReady.gif",
                    champion: ""
                },
                sounds: {
                    themeSong: "yodaTheme.mp3",
                    hypeSound: "yodaHype.mp3",
                    attackSound: "yodaAttack.mp3"
                },
                oneLiner: "Match we will this fight.",
                forceColor: ""
            },
            {
                name: "Obi Wan Kenobi",
                status: "",
                hp: 130,
                totalHp: 130,
                attackPower: 11,
                attackIncrement: 11,
                counterPower: 27,
                images: {
                    roster: "obiWanRoster.jpeg",
                    battle: "obiWanBattle.jpg",
                    defeat: "obiDefeat.gif",
                    ready: "obiWanHype.gif"
                },
                sounds: {
                    hypeSound: "obiWanHype.mp3",
                    attackSound: "obiWanAttack.mp3",
                    themeSong: "obiWanBattle.mp3"
                },
                oneLiner: "These are not the drones you're looking for.",
                forceColor: ""
            }
        ],
        openingSong: "openingSong.mp3",
        totalEnemies: 0,
        enemiesDefeated: 0,
        currentPlayer: {},
        currentEnemy: {},
        normalizeCounterPowers: function(){
            // console.log("running normalizeCounterPowers()");
            $.each(this.players, function(){
                $(this).get(0).counterPower -= game.players.length;
            });
        },
        playSound: function (filePath) {
            // console.log('running playSound()');
            audio = $('#game-speaker');
            // console.log(audio);
            audio.attr('src', "assets/audio/" + filePath);
            audio.get(0).play();
        },
        playMusic: function (filePath) {
            // console.log('running playSound()');
            audio = $('#song-speaker');
            audio.loop = true;
            // console.log(audio);
            audio.attr('src', "assets/audio/" + filePath);
            audio.get(0).play();
        },
        loadRoster: function () {
            $('#start-menu').hide();
            this.totalEnemies = this.players.length - 1;
            $.each(this.players, function () {
                // console.log('iteration of this.players');
                // console.log(this);
                var playerHolder = $('<div>');
                playerHolder.addClass('player');
                playerHolder.addClass('col-md-4 col-6');
                playerHolder.attr('data-name', this.name);
                playerHolder.html("<div class='image-wrapper'><img src=assets/images/" + this.images.roster + "><div class='player-overlay'><span class='player-name'>" + this.name + "</span><div class='hp'>" + this.totalHp + "</div></div></div>");
                // console.log(playerHolder);
                $('#roster').append(playerHolder);
            });
        },
        loadPlayer: function (playerObject, isBattleMode) {
            this.playSound(playerObject.sounds.hypeSound);
            var contender = $('<div>');
            contender.addClass('contender');
            // console.log(playerObject);
            // console.log('object passed to loadPlayer()');
            contender.attr('id', playerObject.name.replace(' ', '-').replace(' ','-'));
            contender.html("<h3>" + playerObject.name + "</h3><div class='image-wrapper'><img class='" + playerObject.status + "-image' src=assets/images/" + playerObject.images.ready + "><div class='health-wrapper'><div class='health' style='width: 100%'><span class='current-hp'>" + playerObject.hp + "</span></div></div></div>");
            if (playerObject.status == "hero") {
                $('#hero').append(contender);
            } else {
                $('#enemy').append(contender);
            }
        },
        fadeOut: function (selector) {
            // console.log('running fadeOut()');
            // debugger;
            $(selector).animate({
                opacity: 0
            }, 4000);
            setTimeout(function () {
                $(selector).hide();
            }, 4000);
        },
        isChampion: function () {
            // console.log('running isChampion()');
            // console.log(this.enemiesDefeated + ' of ' + this.totalEnemies + ' enemies defeated');
            return (this.enemiesDefeated === this.totalEnemies);
        },
        states: ['intro', 'new-game', 'battle-ready', 'battle-mode', 'victory', 'defeat'],
        changeState: function (newState) {
            // console.log('running changeState()');
            var stateToRemove;
            for (i = 0; i < this.states.length; i++) {
                $('body').removeClass(this.states[i]);
            }
            // $.each(this.states,function(){
            //     stateToRemove = $(this);
            // });
            $('body').addClass(newState);
            this.state = newState;
            // console.log(this);
        },
        victory: function () {
            this.enemiesDefeated++;
            // this.state = "victory";
            this.changeState('victory');
            // console.log('victory');
            // console.log(this);
            $('#attack-btn').hide();
            this.changePlayerImage('defeat', '.enemy-image');
            if (this.isChampion()) {
                $('#status-message').html("You are a true Jedi. Or um, if you chose someone from the dark side...I guess you're like a true Dark Jedi or something.");
            } else {
                this.changePlayerImage('ready', ".hero-image");
                $('#status-message').html("You won!<br>Select another player to fight.");
            }
            $('#status-message').show();
            // $('#enemy img').attr('src',this.currentEnemy.images.defeat);
            this.fadeOut('#' + this.currentEnemy.name.replace(' ', '-').replace(' ','-').replace(' ','-'));
        },
        defeat: function () {
            $('#attack-btn').hide();
            this.changePlayerImage('defeat', '.hero-image');
            this.changePlayerImage('ready', '.enemy-image');
            this.currentPlayer.hp = 0;
            this.changeHealth('#hero .health', 0, 'currentPlayer');
            this.changeState('defeat');
            // console.log('defeat');
            this.playSound(this.currentEnemy.sounds.victory);
            this.fadeOut('#' + this.currentPlayer.name.replace(' ', '-'));
        },
        changeHealth: function (target, percent, player) {
            $(target).attr('style', "width: " + percent + "%");
            $(target + ' .current-hp').text(this[player].hp)
        },
        animateBeingAttacked: function (target) {
            $(target).addClass('attack');
            setTimeout(function () {
                $(target).removeClass('attack');
            }, 2000);
        },
        animatePreAttackFlex: function (target) {
            $(target).addClass('flex');
            setTimeout(function () {
                $(target).removeClass('flex');
            }, 2000);
        },
        playerAttack: function (power, sound) {
            //make attack sound
            // console.log(this.currentEnemy);
            this.animatePreAttackFlex('#hero .contender');
            this.currentEnemy.hp -= this.currentPlayer.attackPower;
            this.currentPlayer.attackPower += this.currentPlayer.attackIncrement;
            setTimeout(function () {
                game.playSound(game.currentPlayer.sounds.attackSound);
                game.animateBeingAttacked('#enemy .contender');
                if (game.currentEnemy.hp <= 0) {
                    game.currentEnemy.hp = 0;
                    game.currentEnemy.status = "defeated";
                    game.changeHealth('#enemy .health', 0, 'currentEnemy');
                    game.victory();
                    return true;
                } else {
                    game.changeHealth('#enemy .health', (game.currentEnemy.hp / game.currentEnemy.totalHp) * 100, 'currentEnemy');
                    setTimeout(function () {
                        game.playerCounterAttack();
                    }, 3000);
                }
            }, 1500);
            // console.log(this.currentEnemy);
            return false;
        },
        playerCounterAttack: function (power, sound, oneLiner) {
            // console.log('counter attacking');
            this.animatePreAttackFlex('#enemy .contender');
            this.currentPlayer.hp -= this.currentEnemy.counterPower;
            setTimeout(function () {
                game.playSound(game.currentEnemy.sounds.attackSound);
                game.animateBeingAttacked('#hero .contender');
                game.changeHealth('#hero .health', (game.currentPlayer.hp / game.currentPlayer.totalHp) * 100, 'currentPlayer');
                $('#attack-btn').show();
                if (game.currentPlayer.hp <= 0) {
                    game.defeat();
                }
            }, 1500);
            // console.log(this.currentPlayer);
        },
        getBattleReady: function (name) {
            this.changeState('battle-ready');
            this.normalizeCounterPowers();
            $.each(this.players, function () {
                if (this.name == name) {
                    game.currentPlayer = this;
                    this.status = "hero";
                    game.playMusic(this.sounds.themeSong);
                } else {
                    this.status = "enemy";
                }
            });
            this.loadPlayer(game.currentPlayer);
            // console.log(this);
        },
        changePlayerImage: function (imgType, target) {
            // console.log('changing images');
            var currentObject;
            if (target == ".hero-image") {
                currentObject = "currentPlayer";
            } else {
                currentObject = "currentEnemy";
            }
            // console.log($(target));
            $(target).attr('src', "assets/images/" + game[currentObject].images[imgType]);
        },
        getBattleMode: function (name) {
            $('#counter').show();
            $("#attack-btn").hide();
            $('#status-message').hide();
            // console.log("running getBattleMode()");
            this.changeState('battle-mode');
            $.each(this.players, function () {
                if (this.name == name) {
                    game.currentEnemy = this;
                }
            });
            // this.state = "battle-mode";
            // console.log(this);
            var counter = 5;
            // console.log(counter);
            $('#counter').text(counter);
            var timer = setInterval(() => {
                counter = parseInt($('#counter').text());
                if (counter > 1) {
                    // console.log('deducting from counter');
                    counter--;
                    $('#counter').text(counter);
                } else {
                    // console.log('counter finished');
                    $('#counter').text("Fight!");
                    clearInterval(timer);
                    setTimeout(function () {
                        $('#counter').hide();
                        $("#attack-btn").show();
                        game.changePlayerImage('battle', ".hero-image");
                        game.changePlayerImage('battle', ".enemy-image");
                    }, 1000);

                }
            }, 500);

            this.loadPlayer(game.currentEnemy);
        }

    }
    $('#start-menu button').click(function () {
        $('#iframeAudio').remove();
        game.changeState("new-game");
        game.loadRoster();
        $('.player').click(function () {
            // console.log('player clicked');
            if (game.state == "new-game") {
                $(this).attr('data-type', "hero");
                name = $(this).attr('data-name');
                game.getBattleReady(name);
                $(this).hide();
            } else if (game.state == "battle-ready" && $(this).attr('data-type') != "hero" || game.state == "victory" && $(this).attr('data-type') != "hero") {
                name = $(this).attr('data-name');
                game.getBattleMode(name);
                $(this).hide();
            } else if (game.state == "battle-mode" || game.state == "defeat") {
                // do nothing
            }

        });
    });
    $('#attack-btn').click(function () {
        $(this).hide();
        game.playerAttack();
        // if (game.state == "battle-mode") {
        //     if (!game.playerAttack()) {
        //         setTimeout(function () {
        //             // game.playerCounterAttack();
        //             // $('#attack-btn').show();
        //         }, 3000);
        //     }
        // } else {

        // }

    });
    // game.playSound('openingSong.mp3');
});