package nbpengine;

import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URL;
import java.net.URLConnection;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class NbpUtils {
    public String getUrlContent(String urlAddress)
    {
        URL url;
        URLConnection urlConnection;
        BufferedReader bufferedReader;
        StringBuilder stringBuilder;
        String ret = null;

        try
        {

            url = new URL(urlAddress);
            urlConnection = url.openConnection();
            bufferedReader = new BufferedReader(new InputStreamReader(urlConnection.getInputStream(),StandardCharsets.UTF_8));
            stringBuilder = new StringBuilder();

            String helper = "";

            while((helper=bufferedReader.readLine())!=null)
            {
                stringBuilder.append(helper);
            }

            ret = stringBuilder.toString();

        }catch(Exception e)
        {
            System.out.println(e.getMessage());
        }
        return ret;
    }

    public Node getNode(Node node) {
        Element elementNode = (Element) node;
        return elementNode.getChildNodes().item(0);
    }

    public String getSingleNodeValue(Node node) {
        Element elementNode = (Element) node;
        return elementNode.getChildNodes().item(0).getNodeValue();
    }

    public HashMap<String, String> prepareMap(Node node) {
        NodeList rateNodes = node.getChildNodes();

        HashMap<String, String> valuteMap = new HashMap<>();

        for (int i = 0; i < rateNodes.getLength(); i++) {
            valuteMap.put(rateNodes.item(i).getNodeName(), getSingleNodeValue(rateNodes.item(i)));
        }

        return valuteMap;
    }

    public String historyUrlBuilder(String valuteCode, String dateFrom, String dateTo) {
        return null;
    }
}
