import warnings


def divide_by(number):
    if number == 10:
        warnings.warn("Deprecated")
    return number / 2

if __name__ == "__main__":
    print divide_by(212)
    print divide_by(10)

