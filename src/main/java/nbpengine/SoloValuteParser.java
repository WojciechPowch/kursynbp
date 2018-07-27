package nbpengine;

import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;

import org.w3c.dom.Document;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import java.io.StringReader;
import java.util.HashMap;
import java.util.Map;

public class SoloValuteParser {
    private NbpUtils nbpUtils = new NbpUtils();

    private String urlBuilder(String code) {
        String urlPattern = "http://api.nbp.pl/api/exchangerates/rates/a/";
        return urlPattern + code + "/?format=xml";
    }

    public Object getValuteInfo(String code) {
        String content = nbpUtils.getUrlContent(urlBuilder(code));
        Map<String, Object> valuteMap = new HashMap<>();

        DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();

        try {
            DocumentBuilder db = dbf.newDocumentBuilder();
            Document doc = db.parse(new InputSource(new StringReader(content)));

            valuteMap.put("name", nbpUtils.getSingleNodeValue(doc.getElementsByTagName("Currency").item(0)));
            valuteMap.put("code", nbpUtils.getSingleNodeValue(doc.getElementsByTagName("Code").item(0)));

            Node rateNode = nbpUtils.getNode(doc.getElementsByTagName("Rates").item(0));

            valuteMap.put("valuteInfo", nbpUtils.prepareMap(rateNode));

            return valuteMap;
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }

        return null;
    }

}
