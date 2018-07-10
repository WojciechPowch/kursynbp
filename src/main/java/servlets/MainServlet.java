package servlets;

import org.json.JSONObject;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;

public class MainServlet extends HttpServlet {
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException,IOException{
        response.setContentType("text/html");

        RequestDispatcher dispatcher = request.getRequestDispatcher("index.html");

        if(dispatcher != null){
            dispatcher.forward(request, response);
        }
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response){
        StringBuilder builder = new StringBuilder();
        String line = null;

        try{
            BufferedReader reader = request.getReader();

            while((line=reader.readLine())!=null){
                builder.append(line);
            }
        }catch(Exception e){
            System.out.println(e.getMessage());
        }

        try{

            JSONObject jsonObject = new JSONObject(builder.toString());

            response.setContentType("text/html");
            PrintWriter out = response.getWriter();

            String command = jsonObject.getString("command");

            switch(command){
                case "vievCfg":
                    break;
                case "get":
                    break;
            }

        }catch(Exception e){
            e.getMessage();
        }
    }
}
