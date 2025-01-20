import tkinter as tk
from tkinter import simpledialog, messagebox

class BitmapEditor:
    def __init__(self, master, width=16, height=16, pixel_size=20):
        self.master = master
        self.width = width
        self.height = height
        self.pixel_size = pixel_size
        self.bitmap = [[0 for _ in range(self.width)] for _ in range(self.height)]
        self.rectangles = {}

        self.canvas_width = self.width * self.pixel_size
        self.canvas_height = self.height * self.pixel_size

        self.canvas = tk.Canvas(master, width=self.canvas_width, height=self.canvas_height, bg='white')
        self.canvas.pack()

        self.draw_grid()
        self.canvas.bind("<Button-1>", self.toggle_pixel)

        print_button = tk.Button(master, text="Print Bitmap", command=self.print_bitmap)
        print_button.pack(pady=10)

    def draw_grid(self):
        for y in range(self.height):
            for x in range(self.width):
                x1 = x * self.pixel_size
                y1 = y * self.pixel_size
                x2 = x1 + self.pixel_size
                y2 = y1 + self.pixel_size
                rect = self.canvas.create_rectangle(
                    x1, y1, x2, y2,
                    fill='white',
                    outline='gray'
                )
                self.rectangles[(x, y)] = rect

    def toggle_pixel(self, event):
        x = event.x // self.pixel_size
        y = event.y // self.pixel_size
        if 0 <= x < self.width and 0 <= y < self.height:
            # Toggle the pixel state
            self.bitmap[y][x] = 1 - self.bitmap[y][x]
            # Update the color
            color = 'black' if self.bitmap[y][x] == 1 else 'white'
            self.canvas.itemconfig(self.rectangles[(x, y)], fill=color)

    def print_bitmap(self):
        black_pixels = []
        for y in range(self.height):
            for x in range(self.width):
                if self.bitmap[y][x] == 1:
                    black_pixels.append([x, y])
        print(black_pixels)
        # Optionally, show a message box
        messagebox.showinfo("Bitmap Printed", f"The bitmap has been printed to the console:\n{black_pixels}")

def main():
    root = tk.Tk()
    root.title("Bitmap Editor")

    # Prompt user for bitmap size
    try:
        width = simpledialog.askinteger("Input", "Enter bitmap width (number of pixels):", minvalue=1, maxvalue=100)
        height = simpledialog.askinteger("Input", "Enter bitmap height (number of pixels):", minvalue=1, maxvalue=100)
        if width is None or height is None:
            raise ValueError("Bitmap size not provided.")
    except Exception as e:
        messagebox.showerror("Error", f"Invalid input: {e}")
        root.destroy()
        return

    app = BitmapEditor(root, width=width, height=height, pixel_size=20)
    root.mainloop()

if __name__ == "__main__":
    main()
