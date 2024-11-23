import kaboom from "https://unpkg.com/kaboom@3000.0.1/dist/kaboom.mjs";

kaboom();

loadSound("PlayerStab", "Sounds/PlayerStab.mp3")
loadSound("PlayerRun", "Sounds/PlayerRun.mp3")
loadSound("SlimeAttack", "Sounds/SlimeAttack.mp3")
loadSound("BgMusic", "Sounds/BgMusic.mp3")
loadSound("ShopBgMusic", "Sounds/ShopBgMusic.mp3")

loadSprite("SwordFish","Images/SWORDFISH.png")
loadSprite("Peasant","Images/Peasant.png", {
    sliceX:8,
    sliceY:5,
    anims:{
        "idle":{
            from:0,
            to:5,
            loop: true,
        },
        "run":{
            from:8,
            to:13,
            speed:13
            
        },
        "jump":{
            from:16,
            to:23,
        },
        "attack":{
            from:32,
            to:35,
            loop:false
        }
    }
})
loadSprite("FireAttack","Images/FireAttack.png",{
    sliceX:13,
    sliceY:1,
    anims:{
        "Startup":{
            from:0,
            to:1
        },
        "Active":{
            from:2,
            to:5,
            loop:true
        },
        "Hit":{
            from:6,
            to:12
        }
    }
})
loadSprite("SlimeR","Images/SlimeR.png",{
    sliceX:7,
    sliceY:3,
    anims:{
        "Move":{
            from:0,
            to:6,
        },
        "Attack":{
            from:7,
            to:10
        },
        "Death":{
            from:14,
            to:16,
        }

    }
})
loadSprite("SlimeB","Images/SlimeB.png",{
    sliceX:10,
    sliceY:3,
    anims:{
        "Move":{
            from:0,
            to:6,
        },
        "Attack":{
            from:10,
            to:19,
        },
        "Death":{
            from:20,
            to:22,
        }
    }
})
loadSprite("SlimeG","Images/Slime.png", {
    sliceX:8,
    sliceY:2,
    anims:{
        "Move":{
            from:0,
            to:7,
            loop:true
            
        },
        "Attack":{
            from:8,
            to:10,
            loop:true
        },
        "Death":{
            from:12,
            to:14,
            speed:12,
        }
    
    }
})


console.log("HELLO")





scene("Title", ()=>{
    add([
        rect(width(), height()),
        color(12,12,12)
    ]);
    
    add([
        rect(1300,500),
        color(0,0,0),
        pos(width()/2, height()/2.55),
        anchor("center")
    ])

    add([
        text("Stab and Burn Slimes", 64),
        pos(width()/2, height()/3),
        anchor("center"),
        scale(3)
        
    ]);

    add([
        text("Press space to start", 32),
        pos(width()/2, height()/2.1),
        anchor("center"),
        scale(1.1)
    ]);

    

    onKeyPress("space", ()=>{
        go("main");
    })
})

let round = 1;
let player_maxhealth = 10;
let player_health = 10;
let player_maxmana = 40;
let player_mana = 40;
let player_manaRg = 0.01
let player_DmgMod = 1
let timer = 30;
let start_time = time();
let spawn_timer = time();
let enemy_spawn = rand(1, 7/round)
let points = 52200;
let iframes = 0
let m1 = false
let EnemType = 0


//Round Modifiers:
let EnHpMult = 1
let EnDmgMult = 1
let EnBlue = false
let EnIDK = false


const Music = play("BgMusic", {loop:true,paused:false,speed:0.8,volume:0.00000006})
const ShopMusic = play("ShopBgMusic", {loop:true,paused:true,speed:1.5,volume:0.00000007})
const WalkSfx = play("PlayerRun",{loop:true,paused:true,speed:1.1,volume:0.0000008})


scene("main", ()=>{

    let enemies = [];
    let PossEnem = ["SlimeG","SlimeR","SlimeB","SlimeG","SlimeR","SlimeB"]
    // HP, DMG, SPD, Size( slime scale)
    let EnemStats = [[10,1,1,1],[25,1.6,0.8,1],[8,0.85,1.3,1],[40,4,0.8,2],[120,6.4,0.6,2],[20,2,1.35,2]] 
    EnHpMult = EnHpMult*1.15
    EnDmgMult = EnDmgMult*1.125
    let projectiles = []


    setGravity(2400)
    // 10 | 40
    let timer = 30;
    let start_time = time();
    let spawn_timer = time();

    const bg = add([
        rect(width(),height()),
        color(55,55,55),
        
    
    ])

    const ground = add([
        rect(width()+350,140),
        color(0,0,0),
        pos(0, height()-140),
        area(),
        body({isStatic: true})
    ])

    const player = add([
        sprite("Peasant"),
        pos(width()/2,height()/2),
        scale(1.5),
        area({scale:0.7, offset:new Vec2(0,+20)}),
        body(),
        anchor("center")
    ])

    player.play("idle")

    //add([
        //rect(358,158),
        //color(0,0,0),
        //pos(0, 0),
        
    //])



    //ALL THE TEXTS AND BGS FOR THE TEXT
    //ALL THE TEXTS AND BGS FOR THE TEXT
    //ALL THE TEXTS AND BGS FOR THE TEXT

    const health_bar_bg = add([
        rect(300,40),
        color(90,1,1),
        pos(25,25)
    ])

    const health_bar = add([
        rect(300, 40),
        color(180, 1, 1),
        pos(25,25),
        
    ])

    const mana_bar_bg = add([
        rect(300,40),
        color(1,1,90),
        pos(25,90)
    ])

    const mana_bar = add([
        rect(300, 40),
        color(1, 1,180),
        pos(25,90),
        
    ])

    add([
        rect(300,80),
        color(0,0,0),
        pos(width()/2-150, 80),
        
    ])

    const timer_text = add([
        text("0"),
        anchor("center"),
        scale(2),
        pos(960,128)
        

    ])

    add([
        rect(450,80),
        color(0,0,0),
        pos(1470, 8),
    ])
    
    const round_text = add([
        text("Round [ " + round + " ]"),
        anchor("center"),
        scale(1.5),
        pos(1700,50)
    ])

    add([
        rect(550,80),
        color(0,0,0),
        pos(1370, 108),
    ])
    
    const point_text = add([
        text("Points [" + points + "]"),
        anchor("center"),
        scale(1.5),
        pos(1650,150)
        
    ])

    onKeyDown("d", ()=>{
        if (player.curAnim() !== "attack"){
            player.move(200,0)
            player.flipX = false
            if (player.isGrounded() && player.curAnim() !== "run") {
                player.play("run")
                
                WalkSfx.paused = false
            }
        }
        else{
            player.move(22,0)
            player.flipX = false
        }
    })

    onKeyDown("a", ()=>{
        if (player.curAnim() !== "attack"){
            player.move(-200,0)
            player.flipX = true
            if (player.isGrounded() && player.curAnim() !== "run") {
                player.play("run")
                WalkSfx.paused = false
        }
        }
        else{
            player.move(-22,0)
            player.flipX = true
        }
        
    })

    onMousePress(()=>{
        m1 = true;
        
        if (player.curAnim() !== "attack"){
            play("PlayerStab")
            player.play("attack")
            WalkSfx.paused = true
            
        }
    })

    onKeyPress("q", ()=>{
        if (player.curAnim() !== "attack"){
            if (player_mana >= 5){
                player_mana -= 5
                let projectile = add([
                    sprite("FireAttack"),
                    pos(player.pos),
                    anchor("center"),
                    area(),
                    "Fireball",
                ])
                if (player.flipX){
                    projectile.flipX = true
                }
                else{
                    projectile.flipX = false
                }
                projectile.play("Startup")
                projectiles.push(projectile)
            }
        }
    })
    

    

    player.onAnimEnd((anim)=>{
        if (anim === "attack"){
            player.play("idle")
            WalkSfx.pause = true
            m1 = false;
            for (let i = 0; i< enemies.length; i++){
                if (enemies[i][2] === true){
                    enemies[i][2] = false
                }
            }
            
        }
        
        
    })

    onKeyDown("space", ()=>{
        if(player.isGrounded()){
            player.jump(900)
        }
    })



    player.onCollideUpdate("enemy", (enemy) =>{
        
        
        
        if (player.curAnim() === "attack"){
            
            for (let i = 0; i< enemies.length; i++){
                if (enemies[i][0] === enemy){
                    if (enemies[i][2] === false){
                        enemies[i][1] -= 5*player_DmgMod
                        enemies[i][4].width = (100*(enemies[i][1]/enemies[i][7]))
                        if (enemies[i][1] <= 0){
                            if (enemy.curAnim !== "Death"){
                                enemy.play("Death")
                                points += 5*round
                            }
                        }
                        enemies[i][2] = true
                        debug.log("HURT")
    
    
                    }
                }
                
            
            }
            
            
        }


        if (enemy.curAnim() === "Attack"){
                
            for (let i = 0; i< enemies.length; i++){
                if (enemies[i][0] === enemy){
                    player_health -= enemies[i][5]*0.0024
                }
            }
            
        }
    
        if (enemy.health <= 0){
            if (enemy.curAnim !== "Death"){
                enemy.play("Death")
                points += 5*round
            }
        }
        
    
        if(player_health <= 0){
            go("game_over")
        }
        
        
        
    })
    
    onCollide("enemy", "Fireball", (E,P)=>{
        if (P.curAnim() === "Active"){
            P.play("Hit")
            for (let i = 0; i< enemies.length; i++){
                if (enemies[i][0] === E){
                    if (enemies[i][2] === false){
                        
                        enemies[i][1] -= 3*player_DmgMod
                        enemies[i][4].width = (100*(enemies[i][1]/enemies[i][7]))
                        if (enemies[i][1] <= 0){
                            if (E.curAnim !== "Death"){
                                E.play("Death")
                                points += 5*round
                            }
                        }
                        if (P.flipX === false){
                            E.pos.x += 7
                        }
                        else{
                            E.pos.x -= 7
                        }
                        
                        debug.log("HURT")
    
    
                    }
                }
                
            
            }
        }
        
    })
   


    player.onGround(() => {
        if (!isKeyDown("a") && !isKeyDown("d")) {
            player.play("idle")
            WalkSfx.paused = true
        } else {
            player.play("run")
        }
    })

    ;["a", "d"].forEach((key) => {
        onKeyRelease(key, () => {
        // Only reset to "idle" if player is not holding any of these keys
            if (player.isGrounded() && !isKeyDown("a") && !isKeyDown("d")) {
                player.play("idle")
                WalkSfx.paused = true
            }
        })
    })

 
    onUpdate(()=>{
        if (player_mana < player_maxmana){
            player_mana += player_manaRg
        }
        health_bar.width = (player_health/player_maxhealth)*300;
        mana_bar.width = (player_mana/player_maxmana)*300;
        if (Math.ceil(timer -(time() - start_time)) >= 0){
            timer_text.text = Math.ceil((timer - (time() - start_time)))
            timer_text.pos.x = width()/2
        }
        //debug.log(player.frame)
        

        if (spawn_timer + enemy_spawn < time()){
            spawn_timer = time();
            let enemy_spawn = rand(1, 7/round)
            if (enemy_spawn < 1){
                enemy_spawn = 1
            }
            if (round >= 8){
                EnemType = Math.round(Math.random()*5)
                console.log(round)
            }
            else if (round >= 4){
                EnemType = Math.round(Math.random()*2)
            }
            else{
                EnemType = 0
            }
            
            let e = NaN
            if (EnemType <= 2){
                e = add([

                    sprite(PossEnem[EnemType]),
                    pos(rand(width()+50, width()+125), height()-230),
                    scale(1.4*EnemStats[EnemType][3]),
                    
                    area({scale:0.6, offset:new Vec2(0,+42)}),
                    
                    anchor("center"),
                    "enemy",
                ])
            }
            else if (EnemType <= 5){
                e = add([

                    sprite(PossEnem[EnemType]),
                    pos(rand(width()+50, width()+125), height()-320),
                    scale(1.4*EnemStats[EnemType][3]),
                    
                    area({scale:0.6, offset:new Vec2(0,+42)}),
                    
                    anchor("center"),
                    "enemy",
                ])
            }
            
            
            
            let HBO = add([
                rect(100,10),
                pos(e.pos.x,e.pos.y-40),
                color(0,0,0),
                anchor("center"),
            ])
            let HBB = add([
                rect(100,10),
                pos(e.pos.x,e.pos.y-40),
                color(255,0,0),
                anchor("center"),
                
            ])
            

            enemies.push([e,EnemStats[EnemType][0]*EnHpMult,false,HBO,HBB,EnemStats[EnemType][1]*EnDmgMult,EnemStats[EnemType][2],EnemStats[EnemType][0]*EnHpMult])
            

            
            
        }
        
        for (let i = 0; i< enemies.length; i++){
            // debug.log(enemies[i][0].frame)
            try{
                enemies[i][3].pos.x = enemies[i][0].pos.x
                enemies[i][4].pos.x = enemies[i][0].pos.x
            }
            catch{
                console.log(enemies[i].pos)
            }
            

            if (enemies[i][0].curAnim() !=="Death"){
                if (player.pos.x > enemies[i][0].pos.x){
                    enemies[i][0].flipX = true
                    if (player.pos.x - enemies[i][0].pos.x < 65){
                        if (player.pos.y - enemies[i][0].pos.y < -60){
                            if (enemies[i][0].curAnim() !== "Move"){
                                
                                enemies[i][0].play("Move")
                                
                                
                            }
                        }
                        else{
                            if (enemies[i][0].curAnim() !== "Attack"){
                                    play("SlimeAttack")
                                    enemies[i][0].play("Attack")
                                
                            }
                        }
                        
                    }
                    else{
                        if (enemies[i][0].curAnim() !== "Death"){
                            enemies[i][0].move(enemies[i][6]*100,0)
                        }
                        if (enemies[i][0].curAnim() !== "Move"){
                            
                            enemies[i][0].play("Move")
                            
                        }
                    }
                    
    
    
                }
                else{
    
                    enemies[i][0].flipX = false
                    if (player.pos.x - enemies[i][0].pos.x > -65){
                        if (player.pos.y - enemies[i][0].pos.y < -60){
                            if (enemies[i][0].curAnim() !== "Move"){
                                
                                enemies[i][0].play("Move")
                                
                            }
                        }
                        else{
                            if (enemies[i][0].curAnim() !== "Attack"){
                                play("SlimeAttack")
                                enemies[i][0].play("Attack")
                                
                            }
                        }
                        
                        
                    }
                    else{
                        
                        enemies[i][0].move((enemies[i][6]*100)*-1,0)
                        
                        
                        if (enemies[i][0].curAnim() !== "Move"){
                           
                            enemies[i][0].play("Move")
                            
                        }
                        
                    }
                }
                    
                
                
            }
            else{
                if (enemies[i][0].frame === 14){
                    enemies[i][0].destroy()
                    enemies[i][3].destroy()
                    enemies[i][4].destroy()
                    enemies.splice(i,i)
                    
                }
                else if (enemies[i][0].frame === 22){
                    enemies[i][0].destroy()
                    enemies[i][3].destroy()
                    enemies[i][4].destroy()
                    enemies.splice(i,i)
                    
                }
            }
                
            
            
        }


        for (let i = 0; i< projectiles.length; i++){

            if (projectiles[i].curAnim != "Hit"){
                if (projectiles[i].flipX === true){
                    projectiles[i].move(-200,0)
                }   
                else{
                    projectiles[i].move(200,0)
                }
            }

            if (projectiles[i].frame == 1){
                projectiles[i].play("Active")
            }
            


            if ((projectiles[i].frame == 12) || (projectiles[i].pos.x > width()+100) || (projectiles[i].pos.x < -100)){
                projectiles[i].destroy()
                projectiles.splice(i,i)
                debug.log(projectiles.length)
            }
            
            
        }
        

        if (Math.ceil(timer -(time() - start_time)) == 0){
            points += 25*round;
            go("shop")

        }
        
        point_text.text = "Points [" + points + "]";


        
    })

    
})


// i added some shop stuff in my own time

scene("shop", ()=>{
    Music.paused = true
    ShopMusic.paused = false
    WalkSfx.paused = true

    const bg = add([
        rect(width(),height()),
        color(0,0,0),
        pos(0,0)
    
    ])

    add([
        rect(width()/1.25,height()/1.4),
        color(255,255,255),
        pos(width()/10,height()/8.25)
    ])

    add([
        text("SHOP", 32),
        scale(2.5),
        pos(width()/2.23,15)
    ])

    const points_label = add([
        text("Points: " + points, 32),
        scale(1.5),
        pos(20,20)
    ])

    add([
        text("Press space to exit", 32),
        scale(0.8),
        pos(width()/10,height()*0.925),
    ])

    //ITEM TEXTS AND STUFF ITEM TEXTS AND STUFF ITEM TEXTS AND STUFF ITEM TEXTS AND STUFF ITEM TEXTS AND STUFF ITEM TEXTS AND STUFF 

    const item_1 = add([
        rect(200,200),
        color(155,155,155),
        pos(300,355),
        area()
    ])

    add([
        text("Max Hp +20", 32),
        pos(405, 605),
        color(0,0,0),
        scale(1.5),
        anchor("center")
    ])

    add([
        text("150 Points", 32),
        pos(400, 650),
        color(0,0,0),
        scale(1.2),
        anchor("center")
    ])

    const item_2 = add([
        rect(200,200),
        color(155,155,155),
        pos(670,355),
        area()
    ])

    add([
        text("All Dmg +10%", 32),
        pos(775, 605),
        color(0,0,0),
        scale(1.5),
        anchor("center")
    ])

    add([
        text("300 Points", 32),
        pos(770, 650),
        color(0,0,0),
        scale(1.2),
        anchor("center")
    ])

    const item_3 = add([
        rect(200,200),
        color(155,155,155),
        pos(1040,355),
        area()
    ])
    
    add([
        text("Mana RG +30%", 32),
        pos(1145, 605),
        color(0,0,0),
        scale(1.5),
        anchor("center")
    ])

    add([
        text("600 Points", 32),
        pos(1140, 650),
        color(0,0,0),
        scale(1.2),
        anchor("center")
    ])

    const item_4 = add([
        rect(200,200),
        color(155,155,155),
        pos(1410,355),
        area()
    ])

    add([
        text("None for now", 32),
        pos(1515, 605),
        color(0,0,0),
        scale(1.5),
        anchor("center")
    ])

    add([
        text("4444 Points", 32),
        pos(1510, 650),
        color(0,0,0),
        scale(1.2),
        anchor("center")
    ])

    //const DmgStat([
      //  text("DMG",32)
    //])



    item_1.onClick(() =>{
        debug.log("Item 1 clicked")
        if (points >= 150){
            points -= 150;
            points_label.text = "Points: " + points;
            player_maxhealth += 200
        }
    })
    item_2.onClick(() =>{
        debug.log("Item 2 clicked")
        if (points >= 300){
            points -= 300;
            points_label.text = "Points: " + points;
            player_DmgMod += 0.1
        }
    })
    item_3.onClick(() =>{
        debug.log("Item 3 clicked")
        if (points >= 600){
            points -= 600;
            player_manaRg += 0.003
            points_label.text = "Points: " + points;
        }
    })
    item_4.onClick(() =>{
        debug.log("Item 4 clicked")
        if (points >= 0){
            points += 4444;
            points_label.text = "Points: " + points;
        }
    })


    onKeyPress("space", ()=>{
        round += 1;
        player_health = player_maxhealth;
        player_mana = player_maxmana;
    
        Music.paused = false
        ShopMusic.paused = true
        go("main");
        
    })

})

scene("game_over", ()=>{
    Music.paused = true
    ShopMusic.paused = true
    WalkSfx.paused = true
    
    add([
        rect(width(), height()),
        color(0,0,0)
    ]);

    add([
        text("GAME OVER", 64),
        pos(width()/2-80, height()/2)
        
    ]);

    add([
        text("Press space to restart", 32),
        pos(width()/2-80, height()/2+100),
        
    ]);


    onKeyPress("space", ()=>{
        round = 1;
        player_health = player_maxhealth;
        player_mana = player_maxmana;
        timer = 30;
        start_time = time();
        spawn_timer = time();
        enemy_spawn = rand(1, 7-round)
        points = 0;
        Music.paused = false

        go("main");
        
    })

})


go("Title")