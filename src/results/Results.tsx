export function Results() {
    return <>
        <h1>Results</h1>
        <div style={{display:"flex", flexDirection:"column"}}>
          <p style={{maxWidth:"50vw"}}>
            Below, you can find some compositions by the developers and some eager contributors.<br/>We hope the compositions will speak for themselves.<br/>Many thanks to everyone for your submissions! 
          </p>
          <div style={{alignItems:"left", alignSelf:"center"}}>

           {resultsProps.map(props => MediaComponent(props))}
          </div>
        </div>
    </>
}

const resultsProps : MediaProps[] =
 [
    {
        author: 'ProceduraLiszt Developers',
        mp3Url: 'ABA.wav',
        key: 0
    },
    {
      author: 'ProceduraLiszt Developers',
      mp3Url: 'blues.wav',
      key: 1
    },
    {
      author: 'ProceduraLiszt Developers',
      mp3Url: 'fast.wav',
      key: 2
    },
    {
      author: 'ProceduraLiszt Developers',
      mp3Url: 'FGC.wav',
      key: 3
    },
    {
      author: 'Aidan Atkinson',
      mp3Url: 'Aidan.wav',
      key: 4
    },
    {
      author: 'Dávid Macher',
      mp3Url: 'David.wav',
      key: 5
    },
    {
      author: 'Máté Nádudvari',
      mp3Url: 'Nadi.wav',
      key: 6
    },
    {
      author: 'Anonymous Contributor',
      mp3Url: 'anon1.wav',
      key: 7
    },
    {
      author: 'Anonymous Contributor',
      mp3Url: 'anon2.wav',
      key: 8
    },
    {
      author: 'Anonymous Contributor',
      mp3Url: 'anon3.wav',
      key: 9
    },
    {
      author: 'Anonymous Contributor',
      mp3Url: 'anon4.wav',
      key: 10
    },
    {
      author: 'Anonymous Contributor',
      mp3Url: 'anon5.wav',
      key: 11
    },
    {
      author: 'Anonymous Contributor',
      mp3Url: 'anon6.wav',
      key: 12
    },
 ]

interface MediaProps {
  author: string;
  mp3Url: string;
  key: number
}

const MediaComponent: React.FC<MediaProps> = ({ author, mp3Url, key}) => {
  return <>
    <div key={key} style={{display:"flex", flexDirection:"row", alignItems:"center", margin: "0 auto"}}>
      <audio controls src={"../results/" + mp3Url}>Your browser does not support the audio element.</audio> {/* Audio player */}
      <p style={{color:"gray", marginLeft:"1.5ex"}}>{"by " + author}</p>
    </div>
  </>;
};

export default MediaComponent;
