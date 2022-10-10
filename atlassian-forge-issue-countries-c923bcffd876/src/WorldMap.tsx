import ForgeUI, {
  Image,
} from "@forge/ui";
import countryData from './CountryData';

export default class WorldMap {

  countryNames: string[];

  constructor(countryNames: string[]) {
    this.countryNames = countryNames;
  }

  renderCountryPath = (countryInfo, fillColor) => {
    return `<path
      inkscape:connector-curvature="0"
      id="${countryInfo.id}"
      data-name="${countryInfo.name}"
      data-id="${countryInfo.id}"
      d="${countryInfo.path}"
      style="fill:${fillColor};fill-rule:evenodd"
    />`;
  };

  renderCountries = () => {
    return countryData.countryInfos.map((countryInfo) => {
      const highlight = countryData.matchesCountry(countryInfo, this.countryNames);
      const fillColor = highlight ? '#FF5630' : '#f2f2f2';
      return this.renderCountryPath(countryInfo, fillColor);
    });
  };

  render = () => {
    const width = 900;
    const height = 450;
    const namedview = `
      <sodipodi:namedview
        pagecolor="#ffffff"
        bordercolor="#666666"
        borderopacity="1"
        objecttolerance="10"
        gridtolerance="10"
        guidetolerance="10"
        inkscape:pageopacity="0"
        inkscape:pageshadow="2"
        inkscape:window-width="1920"
        inkscape:window-height="1137"
        id="namedview231"
        showgrid="false"
        inkscape:zoom="1.144"
        inkscape:cx="593.00732"
        inkscape:cy="460.46398"
        inkscape:window-x="1192"
        inkscape:window-y="118"
        inkscape:window-maximized="1"
        inkscape:current-layer="svg2"
      />`;
    const defs = `
    <defs id="defs4">
      <style
        type="text/css"
        id="style6">path { fill-rule: evenodd; }
      </style>
    </defs>`;
    const metedata = `
      <metadata id="metadata8">
        <views
            id="views10">
          <view
              h="1001"
              padding="0"
              w="2000"
              id="view12">
            <proj
                flip="auto"
                id="robinson"
                lon0="100.0" />
            <bbox
                h="2233.1"
                w="5271.17"
                x="-2635.59"
                y="-1308.06"
                id="bbox15" />
          </view>
        </views>
        <rdf:RDF>
          <cc:Work
              rdf:about="">
            <dc:format>image/svg+xml</dc:format>
            <dc:type
                rdf:resource="http://purl.org/dc/dcmitype/StillImage" />
            <dc:title />
          </cc:Work>
        </rdf:RDF>
      </metadata>`;
    const svg = `
      <svg
        xmlns:dc="http://purl.org/dc/elements/1.1/"
        xmlns:cc="http://creativecommons.org/ns#"
        xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
        xmlns:svg="http://www.w3.org/2000/svg"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
        xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
        enable_background="new 0 0 2000 1001"
        pretty_print="False"
        style="stroke-linejoin: round; stroke:#000; fill: none;"
        version="1.1"
        viewBox="0 0 2000 1001"
        width="${width}px"
        height="${height}px"
        id="svg2"
        inkscape:version="0.48.4 r9939"
        sodipodi:docname="world.svg"
      >
        ${namedview}
        ${defs}
        ${metedata}
        ${this.renderCountries()}
      </svg>`;
    return (
      <Image
        src={`data:image/svg+xml;utf8,${encodeURIComponent(svg)}`}
        alt='header'
      />
    );
  }

}