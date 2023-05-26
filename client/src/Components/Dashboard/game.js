import React,{ useCallback, useEffect, useMemo, useState } from 'react';
import Phaser from 'phaser';
import GridEngine from 'grid-engine';
import TestScene from './TestScene';


export default function GameComponent() {

  useEffect(() => {
    const game = new Phaser.Game({
      type: Phaser.AUTO,
      title: 'some-game-title',
      parent: 'game-content',
      orientation: Phaser.Scale.LANDSCAPE,
      localStorageName: 'some-game-title',
      width:400,
      height:300,
      autoRound: true,
      pixelArt: true,
      scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH,
        mode: Phaser.Scale.ENVELOP,
      },
      scene: [
        TestScene
      ],
      physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: { y: 0 }
        }
          },
      backgroundColor: '#000000',
    });

  }, []);



  return (
        <>
          <div id="game-content">
          </div>
      </>
  );
}
