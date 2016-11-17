import {SeekBar, SeekBarConfig} from "./seekbar";
import {UIManager} from "../uimanager";

export class VolumeSlider extends SeekBar {

    constructor(config: SeekBarConfig = {}) {
        super(config);

        this.config = this.mergeConfig(config, {
            cssClass: 'ui-volumeslider'
        }, this.config);
    }

    configure(player: bitmovin.player.Player, uimanager: UIManager): void {
        let self = this;

        let volumeChangeHandler = function () {
            if(player.isMuted()) {
                self.setPlaybackPosition(0);
                self.setBufferPosition(0);
            } else {
                self.setPlaybackPosition(player.getVolume());

                self.setBufferPosition(player.getVolume());
            }
        };

        player.addEventHandler(bitmovin.player.EVENT.ON_VOLUME_CHANGE, volumeChangeHandler);
        player.addEventHandler(bitmovin.player.EVENT.ON_MUTE, volumeChangeHandler);
        player.addEventHandler(bitmovin.player.EVENT.ON_UNMUTE, volumeChangeHandler);

        this.onSeekPreview.subscribe(function (sender, args) {
            if(args.scrubbing) {
                player.setVolume(args.position);
            }
        });
        this.onSeeked.subscribe(function (sender, percentage) {
            player.setVolume(percentage);
        });

        // Init volume bar
        volumeChangeHandler();
    }
}