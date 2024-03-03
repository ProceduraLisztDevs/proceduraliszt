import YouTube from 'react-youtube';

const opts = {
    height: '720',
    width: '1280',
    playerVars: {
      autoplay: 1,
    },
  };

export function Tutorial() {
    return <div style={{padding:"3ex"}}>

        <YouTube videoId="uc6zcZ4hKrY" opts={opts} />;
    </div>
}