import java.util.Scanner;
import java.io.*;

public class SampleChatbot {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.println("Chatbot: Hi! How can I assist you today?");
        String userInput;

        do {
            System.out.print("User: ");
            userInput = scanner.nextLine();

            String botResponse = generateResponse(userInput);

            System.out.println("Chatbot: " + botResponse);
        } while (!userInput.equalsIgnoreCase("exit"));

        System.out.println("Chatbot: Goodbye! Have a great day!");
        scanner.close();
    }

    public static String generateResponse(String userInput) {
        String response;

        switch (userInput.toLowerCase()) {
            case "hi":
            case "hello":
                response = "Hello there!";
                break;
            case "What is your name?":
                response = "My name is Chatbot!";
                break;
            case "how are you":
                response = "I'm just a simple chatbot.";
                break;
            case "tell me a joke":
                response = "Why did the math book look sad? Because it had too many problems! 😄";
                break;
            case "wanna be friends":
                response = "We are already friends.";
                break;
            case "open notepad":
                try {
                    Runtime rs = Runtime.getRuntime();
                    rs.exec("notepad");
                } catch (IOException e) {
                    response = "Error: " + e.getMessage();
                }
                response = "Notepad opened.";
                break;
            case "exit":
                response = "Sure, exiting now.";
                break;
            default:
                response = "I'm not sure how to respond to that.";
                break;
        }

        return response;
    }
}