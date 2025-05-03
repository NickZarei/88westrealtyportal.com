function getPointsByActivityType(type: string): number {
    switch (type) {
      case "Google Review":
        return 100;
      case "Office Event Attendance":
        return 100;
      case "88West Video Content":
        return 200;
      case "Recruit Realtor A":
        return 10000;
      case "Recruit Realtor B":
        return 20000;
      case "Community Event":
        return 200;
      default:
        return 0;
    }
  }
  