import Foundation

struct Book {
    var title: String
    var author: String
    var pages: Int
    var publicationYear: Int
    
    func displayInfo() -> String {
        return "Title: \(title), Author: \(author), Pages: \(pages), Publication Year: \(publicationYear)"
    }
}

let book1 = Book(title: "Swift Programming 101", author: "Jane Doe", pages: 250, publicationYear: 2022)
let book2 = Book(title: "Advanced Swift", author: "John Smith", pages: 350, publicationYear: 2023)
let book3 = Book(title: "SwiftUI for Beginners", author: "Emily Davis", pages: 200, publicationYear: 2021)

let output = book1.displayInfo()
print(output)



class Shape {
    func area() -> Double {
        return 0
    }
    
    func perimeter() -> Double {
        return 0
    }
}

class Rectangle: Shape {
    var width: Double
    var height: Double
    
    init(width: Double, height: Double) {
        self.width = width
        self.height = height
    }
    
    override func area() -> Double {
        return width * height
    }
    
    override func perimeter() -> Double {
        return 2 * (width + height)
    }
}

class Circle: Shape {
    var radius: Double
    
    init(radius: Double) {
        self.radius = radius
    }
    
    override func area() -> Double {
        return Double.pi * radius * radius
    }
    
    override func perimeter() -> Double {
        return 2 * Double.pi * radius
    }
}

let rectangle = Rectangle(width: 10, height: 5)
let circle = Circle(radius: 7)

func printDetails(of shape: Shape) {
    print("Area: \(shape.area()), Perimeter: \(shape.perimeter())")
}

printDetails(of: rectangle)
printDetails(of: circle)


protocol Vehicle {
    func drive()
}

struct Car: Vehicle {
    func drive() {
        print("Car is moving")
    }
}

struct Bike: Vehicle {
    func drive() {
        print("Bike is driving")
    }
}

protocol Shape2 {
    func getName() -> String
    func area() -> Double
    func perimeter() -> Double
}

class Circle2: Shape2 {
    var radius: Double
    
    init(radius: Double) {
        self.radius = radius
    }
    
    func getName() -> String {
        return "Circle"
    }
    
    func area() -> Double {
        return Double.pi * radius * radius
    }
    
    func perimeter() -> Double {
        return 2 * Double.pi * radius
    }
}

class Square: Shape2 {
    var side: Double
    
    init(side: Double) {
        self.side = side
    }
    
    func getName() -> String {
        return "Square"
    }
    
    func area() -> Double {
        return side * side
    }
    
    func perimeter() -> Double {
        return 4 * side
    }
}

extension Int {
    func cube() -> Int {
        return self * self
    }
}

let number = 3
print("The cube of \(number) is \(number.cube())")


extension String {
    func toInt() -> Int? {
        return Int(self)
    }
}

let stringNumber = "123"
if let intValue = stringNumber.toInt() {
    print("The Int value of \(stringNumber) is \(intValue)")
} else {
    print("Conversion failed")
}

extension Array where Element: Comparable {
    func minMax() -> (min: Element, max: Element)? {
        guard let minValue = self.min(), let maxValue = self.max() else {
            return nil
        }
        return (minValue, maxValue)
    }
}

let numberArray = [2, 3, 1, 5, 4]
if let result = numberArray.minMax() {
    print("Minimum: \(result.min), Maximum: \(result.max)")
} else {
    print("Array is empty")
}

extension Date {
    func formattedString() -> String {
        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = "MMM dd, yyyy"
        return dateFormatter.string(from: self)
    }
}

let today = Date()
print("Today is \(today.formattedString())")
