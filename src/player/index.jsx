import React, { useEffect, useRef, useState } from "react";
import "./index.css";

const Label = ({ labelData = {}, wrapper }) => {
  const { name, time, type } = labelData;
  const [name1, name2] = (name ?? "").split("/");
  const [labelClass, setLabelClass] = useState("");

  useEffect(() => {
    console.log(time, "time **");
    if (time !== undefined) {
      setTimeout(() => {
        setLabelClass("show");
        if (type === "name") {
          setTimeout(() => {
            // setLabelClass("hide");
          }, 5000);
        }
      }, time * 1000);
    }
  }, [time]);

  const paddings = {
    right: (window.innerWidth - wrapper.width) / 2 + wrapper.width / 40 + "px",
    bottom:
      (window.innerHeight - wrapper.height + 30) / 2 +
      wrapper.height / 40 +
      "px",
  };
  paddings.top = paddings.bottom;
  paddings.left = paddings.right;

  let wrapperStyles = {};
  if (type === "name") {
    wrapperStyles = {
      bottom: paddings.bottom,
      left: paddings.left,
      textAlign: "right",
    };
  } else if (type === "courtesy") {
    wrapperStyles = {
      top: paddings.top,
      left: paddings.left,
      textAlign: "right",
    };
  } else {
    wrapperStyles = {
      top: paddings.bottom,
      right: paddings.right,
      textAlign: "right",
    };
  }

  if (!name1) {
    return null;
  }
  return (
    <div className="label-wrapper" style={wrapperStyles}>
      <div
        className={`label ${type === "name" ? "primary" : ""} ${labelClass}`}
      >
        {name1}
      </div>
      {name2 && <div className={`label ${labelClass}`}>{name2}</div>}
    </div>
  );
};

export const Player = ({ clip, play = false, goHome, onEnded }) => {
  const { clipData, hasBorder, labels = [], title = "" } = clip ?? {};
  const videoRef = useRef(null);
  const [urlReady, setUrlReady] = useState(false);
  const [openClass, setOpenClass] = useState("");
  const [titleClass, setTitleClass] = useState("");
  useEffect(() => {
    if (videoRef?.current && !urlReady) {
      const fileURL = URL.createObjectURL(clipData);
      videoRef.current.src = fileURL;
      setUrlReady(true);
    }
  }, [videoRef]);

  useEffect(() => {
    if (urlReady && play) {
      var isPlaying =
        videoRef.current.currentTime > 0 &&
        !videoRef.current.paused &&
        !videoRef.current.ended &&
        videoRef.current.readyState > videoRef.current.HAVE_CURRENT_DATA;

      if (!isPlaying) {
        videoRef.current.play();
        setOpenClass("open");
        setTimeout(() => {
          setTitleClass("show");
          setTimeout(() => {
            setTitleClass("hide");
          }, 5000);
        }, 2000);
        videoRef.onpause = () => {
            console.log('**** ENDED')
        }
      }
    }
  }, [play, urlReady]);

  const windowRatio = window.innerWidth / window.innerHeight;
  const wrapper = {
    paddingX: 0,
    paddingY: 0,
  };
  if (windowRatio > 1.77) {
    wrapper.height = window.innerHeight;
    wrapper.width = wrapper.height * 1.77;
  } else {
    wrapper.width = window.innerWidth;
    wrapper.height = wrapper.width / 1.77;
  }
  const logoMargins = {
    right: (window.innerWidth - wrapper.width) / 2 + wrapper.width / 100 + "px",
    bottom:
      (window.innerHeight - wrapper.height) / 2 + wrapper.height / 100 + "px",
  };
  if (hasBorder) {
    wrapper.paddingX = wrapper.width / 40;
    wrapper.paddingY = wrapper.height / 40;
  }
  const videoHeight = wrapper.height - wrapper.paddingY * 2;

  return (
    <div
      className={`videoWrapper ${hasBorder ? "with-border" : ""}`}
      style={{
        height: wrapper.height + "px",
        width: wrapper.width + "px",
        padding: `${wrapper.paddingY}px ${wrapper.paddingX}px`,
      }}
    >
      <video ref={videoRef} height={videoHeight} onEnded={onEnded}></video>
      {play && labels.map((l) => <Label labelData={l} wrapper={wrapper} />)}
      {play && <div className={`curtain ${openClass}`}></div>}
      {play && title && <div className={`video-title ${titleClass}`}>{title}</div>}
      <div className="tss-logo" style={logoMargins} onClick={goHome}>
        <div className="pre-heading">SIMPLIFIED</div>
        <div className="post-heading">STORY</div>
      </div>
    </div>
  );
};
