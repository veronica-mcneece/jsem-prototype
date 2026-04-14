import turtle
import math

# -------- User Parameters --------
colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple']
depth = 5          # Recursive depth
symmetry = 6       # Number of repeating arms in mandala
angle = 360 / symmetry

# -------- Recursive Drawing Functions --------
def draw_spiral(t, length, factor):
    """Draw a recursive spiral"""
    if length < 2:
        return
    t.forward(length)
    t.right(20)
    draw_spiral(t, length * factor, factor)

def draw_tessellation(t, size, levels):
    """Draw recursive tessellation-like triangles"""
    if levels == 0:
        return
    for _ in range(3):
        t.forward(size)
        draw_tessellation(t, size/2, levels-1)
        t.left(120)

def draw_mandala(t, radius, depth):
    """Draw a mandala using symmetry and recursion"""
    if depth == 0:
        return
    for i in range(symmetry):
        t.color(colors[i % len(colors)])
        t.circle(radius)
        draw_mandala(t, radius/2, depth-1)
        t.right(angle)

# -------- Setup Turtle --------
screen = turtle.Screen()
screen.bgcolor("black")
t = turtle.Turtle()
t.speed(0)
t.hideturtle()
t.penup()
t.goto(0, -150)
t.pendown()

# -------- Draw Art --------
draw_mandala(t, 150, depth)   # Mandala with recursion
t.penup()
t.goto(-300, 0)
t.pendown()
t.color("cyan")
draw_spiral(t, 200, 0.95)    # Spiral
t.penup()
t.goto(300, 0)
t.pendown()
t.color("yellow")
draw_tessellation(t, 100, 3) # Tessellation

# -------- Finish --------
turtle.done()

