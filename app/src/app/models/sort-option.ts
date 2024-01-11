export default class SortOption {
  static readonly YEAR = new SortOption('Year');
  static readonly MARGIN = new SortOption('Margin');
  static readonly STAGES_WON = new SortOption('Stage wins <span class="text--grey">(percentage)</span>');
  static readonly LEADERS_JERSEY = new SortOption('Stages in lead <span class="text--grey">(percentage)</span>');

  private constructor(public readonly displayName: string) {
  }
}
