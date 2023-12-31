export default class SortOption {
  static readonly YEAR = new SortOption('Year');
  static readonly MARGIN = new SortOption('Margin');
  static readonly STAGES_WON = new SortOption('Stages won');
  static readonly LEADERS_JERSEY = new SortOption('Leaders jersey');

  private constructor(public readonly displayName: string) {
  }
}
