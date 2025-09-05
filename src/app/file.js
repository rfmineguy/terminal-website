class File extends AbstractFSNode {
  /*
   * name     : the display name of the file (including extension if applicable)
   * realpath : the file path that this file references (should exist on the real filesystem)
   */
  constructor(name, realpath) {
    super(name)
    this.realpath = realpath
  }
}
