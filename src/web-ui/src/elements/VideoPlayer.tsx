import { createRef, useState } from "react";
import { formatDuration } from "~/common";
import useIsFullScreen from "~/hooks/useIsFullScreen";
import PlayIconSrc from "@assets/icons/media-control/play.png?inline";
import PauseIconSrc from "@assets/icons/media-control/pause.png?inline";
import EnterFullScreenIconSrc from "@assets/icons/media-control/enter-full-screen.png?inline";
import ExitFullScreenIconSrc from "@assets/icons/media-control/exit-full-screen.png?inline";
import SoundIconSrc from "@assets/icons/media-control/audio.png?inline";
import MutedIconSrc from "@assets/icons/media-control/mute.png?inline";
import Loading from "./Loading";


export default function VideoPlayer(props: JSX.IntrinsicElements["video"]) {
    const isFullScreen = useIsFullScreen();
    const [waiting, setWaiting] = useState(false);
    const controlRef = createRef<HTMLDivElement>();
    const wrapper = createRef<HTMLDivElement>();
    const videoRef = createRef<HTMLVideoElement>();
    const progressRef = createRef<HTMLProgressElement>();
    const timeStringRef = createRef<HTMLSpanElement>();
    const durationStringRef = createRef<HTMLSpanElement>();
    const playImgRef = createRef<HTMLImageElement>();
    const soundImgRef = createRef<HTMLImageElement>();

    function togglePlayPause() {
        if (videoRef.current?.paused) {
            videoRef.current.play();
        } else {
            videoRef.current?.pause();
        }
    }

    function timeUpdate() {
        if (progressRef.current) {
            progressRef.current.value = videoRef.current!.currentTime;
            updateProgress();
        }
    }

    function updateProgress() {
        if (timeStringRef.current && videoRef.current) {
            timeStringRef.current.innerHTML = formatDuration(videoRef.current.currentTime);
        }
    }

    return <div className={props.className}>
        <div
            className="w-full h-full isolate group" ref={wrapper}
            style={{backgroundColor: isFullScreen ? "black" : undefined}}
            onDoubleClick={() => wrapper.current?.requestFullscreen()}
        >
            <video {...props}
                ref={videoRef}
                className="w-full h-full"
                controls={false} autoPlay disablePictureInPicture autoFocus preload="metadata"
                onTimeUpdate={timeUpdate}
                onLoadedMetadata={() => {
                    if (progressRef.current && videoRef.current) {
                        progressRef.current.max = videoRef.current.duration;
                        durationStringRef.current!.innerHTML = formatDuration(videoRef.current.duration);
                    }
                }}
                onPause={() => {
                    if (playImgRef.current) {
                        playImgRef.current.src = PlayIconSrc;
                    }
                }}
                onPlay={() => {
                    if (playImgRef.current) {
                        playImgRef.current.src = PauseIconSrc;
                    }
                }}
                onWaiting={() => setWaiting(true)}
                onPlaying={() => setWaiting(false)}
            >
                {props.children}
            </video>
            {!!waiting && <div className="fixed pointer-events-none centered"><Loading /></div>}
            {!!isFullScreen && <>
                <div className="fixed inset-y-0 left-0 right-1/2" onDoubleClick={() => {
                    if (videoRef.current) {
                        videoRef.current.currentTime -= 10;
                    }
                }} />
                <div className="fixed inset-y-0 right-0 left-1/2" onDoubleClick={() => {
                    if (videoRef.current) {
                        videoRef.current.currentTime += 10;
                    }
                }} />
            </>}
            <div ref={controlRef} className="fixed inset-x-0 bottom-0 transition-opacity duration-200">
                <div className="w-full px-1">
                    <progress ref={progressRef} className="w-full h-3 rounded-md" />
                </div>
                <div className="flex items-center gap-2 px-1">
                    <div>
                        <button onClick={togglePlayPause}>
                            <img ref={playImgRef} className="h-6 invert" src={videoRef.current?.paused ? PauseIconSrc : PlayIconSrc} alt="" />
                        </button>
                    </div>
                    <div className="grow" />
                    <div>
                        <span ref={timeStringRef} className="select-none">{formatDuration(videoRef.current?.currentTime ?? 0)}</span>
                        /
                        <span ref={durationStringRef} className="select-none">{formatDuration(videoRef.current?.duration ?? 0)}</span>
                    </div>
                    <div>
                        <button onClick={() => {
                            if (videoRef.current) {
                                videoRef.current.muted = !videoRef.current.muted;
                            }
                        }}>
                            <img ref={soundImgRef} className="h-6 invert" src={videoRef.current?.muted ? MutedIconSrc : SoundIconSrc} alt="" />
                        </button>
                    </div>
                    <div>
                        <button onClick={() => (document.fullscreenElement ? document.exitFullscreen() : wrapper.current?.requestFullscreen())}>
                            <img className="h-6 invert" src={isFullScreen ? ExitFullScreenIconSrc : EnterFullScreenIconSrc} alt="" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>;
}
