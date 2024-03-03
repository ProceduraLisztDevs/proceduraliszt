export function Results() {
    return <>
        <h2>Results</h2>
        {resultsProps.map(props => MediaComponent(props))}
    </>
}

const resultsProps : MediaProps[] =
 [
    {
        author: 'JSBach',
        mp3Url: 'https://www.chosic.com/wp-content/uploads/2020/06/Brendan_Kinsella_-_01_-_Bach_-_Aria_Variata_BWV_989_Variation_no1(chosic.com).mp3',
        configUrl: 'https://www.chosic.com/wp-content/uploads/2020/06/Brendan_Kinsella_-_01_-_Bach_-_Aria_Variata_BWV_989_Variation_no1(chosic.com).mp3',
        key: 0
    },
 ]

interface MediaProps {
  author: string;
  mp3Url: string;
  configUrl?: string;
  key: number
}

const MediaComponent: React.FC<MediaProps> = ({ author, mp3Url, configUrl, key}) => {
  return (
    <div key={key} style={{display:"flex", flexDirection:"row", alignItems:"center"}}>
    <p>{author}</p>
    <audio controls src={mp3Url}>Your browser does not support the audio element.</audio> {/* Audio player */}
    {
        configUrl ? 
        <a href={configUrl} style={{ display: 'block', marginTop: '10px' }}>
        Download Config
        </a> :
        <p>Config unavailable</p>
    }
    </div>
  );
};

export default MediaComponent;
