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
    private Map<String, String[]> courses = new HashMap<String,String[]>();
    private ArrayList<String> valutes = new ArrayList<>();
    private static NbpParserSn nbpParseSn = new NbpParserSn();

    private NbpParserSn(){
        initializeCourses();
    }

    public static NbpParserSn getInstance(){
        return nbpParseSn;
    }

    public ArrayList<String> getValutes(){
        return valutes;
    }

    private String getUrlContent(String urlAddress)
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
        String content = getUrlContent(urlAddress);


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
            for(int j = 0; j < coursesArr[i].length; j++){
                if(j == 1) {
                    valuteName = coursesArr[i][j];
                    tmpArr[j] = coursesArr[i][j];
                    valutes.add(coursesArr[i][j]);
                }
                else
                    tmpArr[j] = coursesArr[i][j];

                if(j == coursesArr[i].length - 1)
                    courses.put(valuteName,tmpArr);
            }
        }
    }

    public String[] getValute(String valute){
        String[] value = null;

        value = courses.get(valute);

        return value;
    }
}
