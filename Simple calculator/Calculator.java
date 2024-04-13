import java.util.Scanner;

public class Calculator {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int choice;
        
        do {
            // Display menu
            System.out.println("Choose an operation:");
            System.out.println("1. Addition");
            System.out.println("2. Subtraction");
            System.out.println("3. Multiplication");
            System.out.println("4. Division");
            System.out.println("5. Exponentiation");
            System.out.println("6. Quit");
            System.out.print("Enter your choice: ");
            
            // Get user choice
            choice = scanner.nextInt();
            
            // Perform operation based on user choice
            switch (choice) {
                case 1:
                    System.out.print("Enter first number: ");
                    double addNum1 = scanner.nextDouble();
                    System.out.print("Enter second number: ");
                    double addNum2 = scanner.nextDouble();
                    System.out.println("Result: " + add(addNum1, addNum2));
                    break;
                case 2:
                    System.out.print("Enter first number: ");
                    double subNum1 = scanner.nextDouble();
                    System.out.print("Enter second number: ");
                    double subNum2 = scanner.nextDouble();
                    System.out.println("Result: " + subtract(subNum1, subNum2));
                    break;
                case 3:
                    System.out.print("Enter first number: ");
                    double mulNum1 = scanner.nextDouble();
                    System.out.print("Enter second number: ");
                    double mulNum2 = scanner.nextDouble();
                    System.out.println("Result: " + multiply(mulNum1, mulNum2));
                    break;
                case 4:
                    System.out.print("Enter first number: ");
                    double divNum1 = scanner.nextDouble();
                    System.out.print("Enter second number: ");
                    double divNum2 = scanner.nextDouble();
                    if (divNum2 != 0) {
                        System.out.println("Result: " + divide(divNum1, divNum2));
                    } else {
                        System.out.println("Error: Division by zero!");
                    }
                    break;
                case 5:
                    System.out.print("Enter base number: ");
                    double base = scanner.nextDouble();
                    System.out.print("Enter exponent number: ");
                    double exponent = scanner.nextDouble();
                    System.out.println("Result: " + power(base, exponent));
                    break;
                case 6:
                    System.out.println("Exiting...");
                    break;
                default:
                    System.out.println("Invalid choice! Please enter a number between 1 and 6.");
            }
        } while (choice != 6);
        
        scanner.close();
    }
    
    public static double add(double num1, double num2) {
        return num1 + num2;
    }
    
    public static double subtract(double num1, double num2) {
        return num1 - num2;
    }
    
    public static double multiply(double num1, double num2) {
        return num1 * num2;
    }
    
    public static double divide(double num1, double num2) {
        return num1 / num2;
    }
    
    public static double power(double base, double exponent) {
        return Math.pow(base, exponent);
    }
}
