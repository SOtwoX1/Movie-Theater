import React from "react";

const VideoEmbed = ({trailer}) => {
  console.log('this is from video',trailer);
  return (
    <div>
      <iframe
        width="100%"
        height="400"
        src={trailer}
        title="Movie Trailer"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default VideoEmbed;
