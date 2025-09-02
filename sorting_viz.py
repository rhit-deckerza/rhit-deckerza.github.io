import pygame
import random
from PIL import Image
import os

# Visualization settings
WIDTH = 800
HEIGHT = 600
BAR_COUNT = 50
FPS = 60
GIF_FILENAME = "sorting_visualization.gif"

# Colors
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
RED = (255, 0, 0)
GREEN = (0, 255, 0)

def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        swapped = False
        for j in range(0, n - i - 1):
            yield {"type": "compare", "indices": [j, j + 1]}
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
                yield {"type": "swap", "indices": [j, j + 1]}
        if not swapped:
            break
    yield {"type": "done"}

def selection_sort(arr):
    n = len(arr)
    for i in range(n):
        min_idx = i
        for j in range(i + 1, n):
            yield {"type": "compare", "indices": [min_idx, j]}
            if arr[j] < arr[min_idx]:
                min_idx = j
        if min_idx != i:
            arr[i], arr[min_idx] = arr[min_idx], arr[i]
            yield {"type": "swap", "indices": [i, min_idx]}
    yield {"type": "done"}

class SortingVisualizer:
    def __init__(self, sort_func):
        self.arr = [random.randint(10, HEIGHT - 50) for _ in range(BAR_COUNT)]
        self.sort_func = sort_func
        self.sort_gen = None
        self.screen = None
        self.bar_width = WIDTH // BAR_COUNT
        self.running = False
        self.clock = pygame.time.Clock()
        self.frames = []  # List to store frames for GIF

    def setup(self):
        pygame.init()
        self.screen = pygame.display.set_mode((WIDTH, HEIGHT))
        pygame.display.set_caption("Sorting Algorithm Visualization")
        self.sort_gen = self.sort_func(self.arr)
        self.running = True

    def draw(self, highlight_indices=None, swap_indices=None):
        self.screen.fill(BLACK)
        for i, value in enumerate(self.arr):
            color = WHITE
            if highlight_indices and i in highlight_indices:
                color = RED
            if swap_indices and i in swap_indices:
                color = GREEN
            pygame.draw.rect(self.screen,
                            color,
                            (i * self.bar_width, HEIGHT - value, self.bar_width - 2, value))
        pygame.display.flip()
        # Capture frame for GIF
        frame_data = pygame.image.tostring(self.screen, "RGB")
        frame = Image.frombytes("RGB", (WIDTH, HEIGHT), frame_data)
        self.frames.append(frame)

    def save_gif(self):
        if self.frames:
            # Save frames as GIF
            self.frames[0].save(
                GIF_FILENAME,
                save_all=True,
                append_images=self.frames[1:],
                duration=1000 // FPS,  # Duration per frame in milliseconds
                loop=0  # Loop forever
            )
            print(f"GIF saved as {GIF_FILENAME}")

    def run(self):
        self.setup()
        while self.running:
            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    self.running = False
            try:
                event = next(self.sort_gen)
                if event["type"] == "compare":
                    self.draw(highlight_indices=event["indices"])
                elif event["type"] == "swap":
                    self.draw(swap_indices=event["indices"])
                elif event["type"] == "done":
                    self.draw()
                    self.running = False
            except StopIteration:
                self.draw()
                self.running = False
            self.clock.tick(FPS)
        # Save GIF after sorting is complete
        self.save_gif()
        # Keep displaying the final sorted array until window is closed
        while True:
            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    pygame.quit()
                    return
            self.draw()
            self.clock.tick(FPS)

if __name__ == "__main__":
    # Choose sorting algorithm here (e.g., bubble_sort or selection_sort)
    visualizer = SortingVisualizer(bubble_sort)
    visualizer.run()