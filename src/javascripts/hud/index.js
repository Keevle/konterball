import {FontLoader, Group} from 'three';
import TweenMax from 'gsap';
import ScoreDisplay from './score-display';
import Countdown from './countdown';
import Message from './message';
import {MODE, EVENT} from '../constants';
import Arrows from './arrows';

export default class Hud {
  constructor(scene, config, emitter, loader) {
    this.config = config;
    this.emitter = emitter;
    this.scene = scene;
    this.gravity = 0;
    this.ballRadius = 0.03;
    this.ballPaddleBounciness = 1;
    this.ballBoxBounciness = 1;
    this.ballInitVelocity = 1;
    this.paddleModel = 'box';
    this.activateTween = null;

    this.loader = loader;
    this.font = null;
    this.container = null;
    this.initialized = false;
    this.modeWasSelected = false;
  }

  setup() {
    let fontloader = new FontLoader();
    return new Promise((resolve, reject) => {
      Promise.all([
        new Promise((resolve, reject) => {
          fontloader.load('fonts/AntiqueOlive.json', font => {
            this.antique = font;
            resolve();
          });
        }),
        new Promise((resolve, reject) => {
          fontloader.load('fonts/Futura.json', font => {
            this.font = font;
            resolve();
          });
        }),
      ]).then(result => {
        this.container = new Group();
        this.container.position.z = 1;
        this.container.position.y = 1.6;
        this.container.rotation.y = Math.PI;
        this.scene.add(this.container);

        this.initialized = true;

        this.message = new Message(this.scene, this.config, this.font, this.antique, this.emitter);
        this.message.hideMessage();

        this.scoreDisplay = new ScoreDisplay(this.scene, this.config, this.font);
        this.countdown = new Countdown(this.scene, this.config, this.antique);
        this.countdown.hideCountdown();
        Arrows(this.font, this.loader).then(arrow => {
          this.arrows = arrow;
          this.scene.add(arrow);
          resolve();
        }).catch(e => {
          console.log(e);
        });
      }).catch(e => {
        console.log(e);
      });
    }).catch(e => {
      console.log(e);
    });
  }
}
