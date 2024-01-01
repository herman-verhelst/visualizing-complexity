export default class Gradient {
/*  static readonly G1 = new Gradient('#73120F');
  static readonly G2 = new Gradient('#771A12');
  static readonly G3 = new Gradient('#7A2215');
  static readonly G4 = new Gradient('#80311A');
  static readonly G5 = new Gradient('#86411F');
  static readonly G6 = new Gradient('#8C5024');
  static readonly G7 = new Gradient('#784E1E');
  static readonly G8 = new Gradient('#4B4525');
  static readonly G10 = new Gradient('#3D502F');
  static readonly G11 = new Gradient('#2E5B38');
  static readonly G12 = new Gradient('#224d0c');
  static readonly G13 = new Gradient('#519575');
  static readonly G14 = new Gradient('#12876A');
  static readonly G15 = new Gradient('#285665');
  static readonly G16 = new Gradient('#333D62');
  static readonly G9 = new Gradient('#1a216e');
  static readonly G17 = new Gradient('#3E245F');
  static readonly G18 = new Gradient('#501D50');
  static readonly G19 = new Gradient('#621640');
  static readonly G20 = new Gradient('#740F31');
  static readonly G21 = new Gradient('#850821');*/

  static readonly G1 = new Gradient('#12876A');
  static readonly G2 = new Gradient('#285665');
  static readonly G3 = new Gradient('#4c8847');
  static readonly G4 = new Gradient('#2E5B38');
  static readonly G5 = new Gradient('#333D62');
  static readonly G6 = new Gradient('#345777');
  static readonly G7 = new Gradient('#363849');
  static readonly G8 = new Gradient('#3A303A');
  static readonly G10 = new Gradient('#665b77');
  static readonly G11 = new Gradient('#352860');
  static readonly G12 = new Gradient('#49466D');
  static readonly G13 = new Gradient('#56333F');
  static readonly G14 = new Gradient('#5B5F4A');
  static readonly G15 = new Gradient('#6C825B');
  static readonly G16 = new Gradient('#785166');
  static readonly G9 = new Gradient('#7A2215');
  static readonly G17 = new Gradient('#6b4e45');
  static readonly G18 = new Gradient('#825867');
  static readonly G19 = new Gradient('#8E5C5C');
  static readonly G20 = new Gradient('#C67B56');
  static readonly G21 = new Gradient('#6e6653');
  private constructor(public color: string) {
  }

  public getGradient(): string {
    return `linear-gradient(90deg, ${this.color}00, ${this.color})`
  }
}
