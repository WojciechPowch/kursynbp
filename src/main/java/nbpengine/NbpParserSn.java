package nbpengine;

import java.util.Map;
import org.xml.sax.InputSource;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.*;
import java.io.BufferedReader;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.*;
import javax.xml.parsers.*;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.StringReader;
import java.net.*;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.util.*;

/**
 * Dodać metodę pobierania wszystkich nazw walut które są obecnie dostępne
 * */

public class NbpParserSn {
    private Map<String, HashMap<String, String>> courses = new HashMap<String, HashMap<String, String>>();
    private ArrayList<String> valutes = new ArrayList<>();
    private static NbpParserSn nbpParseSn = new NbpParserSn();
    private NbpUtils nbpUtils = new NbpUtils();

    private NbpParserSn(){
        initializeCourses();
    }

    public static NbpParserSn getInstance(){
        return nbpParseSn;
    }

    public ArrayList<String> getValutes(){
        return valutes;
    }

    private String getNode(Node node, String tagname)
    {
        Element elemet = (Element) node;
        NodeList firstNodeList = elemet.getElementsByTagName(tagname);
        Element midElement = (Element) firstNodeList.item(0);
        NodeList secondNodeList = midElement.getChildNodes();
        return secondNodeList.item(0).getNodeValue();
    }

    private String[][] prepareNastedeArr(){
        String urlAddress = "http://api.nbp.pl/api/exchangerates/tables/a/?format=xml";
        String content = nbpUtils.getUrlContent(urlAddress);

        DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
        String[] tagNames ;
        String[][] arr = null;

        try
        {

            DocumentBuilder db = dbf.newDocumentBuilder();
            // w tym miejscu konertowanie zawatości strony na plik XML
            Document doc = db.parse(new InputSource(new StringReader(content)));

            NodeList list = doc.getElementsByTagName("Rate");
            NodeList nl = list.item(0).getChildNodes();
            tagNames = new String[nl.getLength()];
            for(int i = 0; i < tagNames.length; i++)
            {
                tagNames[i] = nl.item(i).getNodeName();
            }
            arr = new String[list.getLength()][3];

            for(int i = 0; i < list.getLength(); i++)
            {
                Node node = list.item(i);
                if(node.getNodeType()==Node.ELEMENT_NODE)
                {
                    for(int j = 0; j < tagNames.length; j++)
                    {
                        arr[i][j] = getNode(node,tagNames[j]);
                    }
                }
            }
            return arr;
        }catch(Exception e)
        {
            System.out.println(e.getMessage());
        }
        return arr;
    }

    private void initializeCourses(){
        String[][] coursesArr = prepareNastedeArr();

        for(int i = 0; i < coursesArr.length; i++){
            String valuteName = null;
            String tmpArr[] = new String[coursesArr[i].length];
            HashMap<String, String> valuteMap = new HashMap<>();
            valuteMap.put("name", coursesArr[i][0]);
            valuteMap.put("code", coursesArr[i][1]);
            valuteMap.put("middleCourse", coursesArr[i][2]);

            valutes.add(coursesArr[i][1]);
            courses.put(coursesArr[i][1], valuteMap);
        }
    }

    public HashMap<String, String> getValute(String valute){
        HashMap<String, String> value = null;

        value = courses.get(valute);

        return value;
    }
}
