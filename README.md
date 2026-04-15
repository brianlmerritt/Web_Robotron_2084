# Web Robotron: 2084 (Work In Progress)
Robotron: 2084 is a classic arcade game released in 1982 by Williams Electronics, Inc.\
This repository aims to faithfully recreate the game with online high score leaderboards

## Usage
Download the source code and open "index.html" with the Live Server extension in VS Code

## Gameplay
Shoot the enemies and rescue the humans to rack as many points as you can!\
At every 25,000 points you get an extra life (indicated next to the score)\
Clear the screen of vulnerable enemies to advance to the next wave\
The game features multiple waves with escalating difficulty

## Enemies
Destroying enemies grants you points but getting too close will cost you a life!

### ![Grunt](/github-images/grunt.png) G.R.U.N.T. (100 Points)
The Ground Roving Unit Network Terminator moves at increasing speeds towards the player

### ![Hulk](/github-images/hulk.png) Hulk
Hulks are indestructible and will destroy humans on contact but can be pushed back with your projectiles

### ![Spheroid](/github-images/spheroid.png) Spheroid (1,000 Points)
A Spheroid roams around the screen. Given enough time, it'll create Enforcers

### ![Enforcer](/github-images/enforcer.png) Enforcer (150 Points)
Enforcers pursue the player while firing Sparks (25 Points)

### ![Brain](/github-images/brain.png) Brain (500 Points)
Brains fire Cruise Missiles (25 Points) that pursue the player\
Will chase humans and convert them into Progs on contact

### ![Prog](/github-images/prog.png) Prog (100 Points)
Progs (or reprogrammed humans) will relentlessly chase the player

### ![Quark](/github-images/quark.png) Quark (1,000 Points)
Quarks behave similarly to Spheroids, but create Tanks instead

### ![Tank](/github-images/tank.png) Tank (200 Points)
Tanks move relatively slowly and fire Bounce Bombs (25 Points) that bounce upon touching a wall

## Humans (1,000 - 5,000 Points)
### ![Humans](/github-images/humans.png)
Rescuing a human grants 1000 points. Every subsequent rescue grants an additional 1000 points up to 5000 total\
Losing a life or advancing to the next wave resets the next rescue to the initial 1000 points

## Obstacles
Obstacles are scattered around the screen and will destroy the player on contact

## Controls
Keyboard and game controllers are supported. Controllers are detected automatically via the browser's Gamepad API.

### Keyboard
| Keyboard Key | Description |
| :----------: | :---------: |
| W | Move up |
| A | Move left |
| S | Move down |
| D | Move right |
| Arrow Up | Shoot up |
| Arrow Left | Shoot left |
| Arrow Down | Shoot down |
| Arrow Right | Shoot right |

### Game Controller
| Input | Description |
| :---: | :---------: |
| Left Stick | Move |
| Right Stick | Shoot |
| Start / A | Start game |
| B | Pause |
| Select | Restart game |

## Debugging Shortcuts
| Keyboard Key | Description |
| :----------: | :---------: |
| R | Resets the current wave |
| H | Draws / hides all hitboxes |
| U | Freezes / unfreezes other actors |
| P | Enables / disables player invincibility |
| O | Enables / disables others' invincibility |
