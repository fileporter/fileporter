import { createRef } from "react";
import { formatDuration } from "~/common";
import useIsFullScreen from "~/hooks/useIsFullScreen";


export default function VideoPlayer(props: JSX.IntrinsicElements["video"]) {
    const isFullScreen = useIsFullScreen();
    const wrapper = createRef<HTMLDivElement>();
    const videoRef = createRef<HTMLVideoElement>();
    const progressRef = createRef<HTMLProgressElement>();
    const timeStringRef = createRef<HTMLSpanElement>();
    const durationStringRef = createRef<HTMLSpanElement>();

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
            className="w-full h-full isolate" ref={wrapper}
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
            >
                {props.children}
            </video>
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
            <div className="fixed inset-x-0 bottom-0 flex gap-1">
                <button onClick={togglePlayPause}>Play/Pause</button>
                <progress ref={progressRef} className="grow" />
                <span><span ref={timeStringRef}>00:00</span>/<span ref={durationStringRef}>00:00</span></span>
                <button onClick={() => {
                    if (videoRef.current) {
                        videoRef.current.muted = !videoRef.current.muted;
                    }
                }}>Mute</button>
                <button onClick={() => (document.fullscreenElement ? document.exitFullscreen() : wrapper.current?.requestFullscreen())}>Fullscreen</button>
            </div>
        </div>
    </div>;
}
