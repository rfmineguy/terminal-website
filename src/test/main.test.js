QUnit.module('filesystem', function() {
  QUnit.module('directory', function() {
    QUnit.test('directory_empty', function() {
      var dir = new DirectoryBuilder('/').build()
      QUnit.assert.equal(dir.name, '/', 'ensure that name is set');
      QUnit.assert.deepEqual(dir.directories, [], 'ensure that directories is empty');
      QUnit.assert.deepEqual(dir.files, [], 'ensure that files is empty');
    });
    QUnit.test('directory_w_files_wo_directories', function() {
      var dir = new DirectoryBuilder('/').setFiles(['test.txt', 'cool.md']).build()
      QUnit.assert.equal(dir.name, '/', 'ensure that name is set');
      QUnit.assert.deepEqual(dir.directories, [], 'ensure that directories is empty');
      QUnit.assert.deepEqual(dir.files, ['test.txt', 'cool.md'], 'ensure that files are set');
    })
    QUnit.test('directory_wo_files_w_single_sub_directory', function() {
      var dir = new DirectoryBuilder('/').setDirectories([
        new DirectoryBuilder('home').build()
      ]).build()
      QUnit.assert.equal(dir.name, '/', 'ensure that name is set');
      QUnit.assert.equal(dir.directories.length, 1, 'ensure that directories has a single entry');
      QUnit.assert.equal(dir.directories[0].name, 'home', 'ensure that the directory entry name is correct');
      QUnit.assert.deepEqual(dir.directories[0].directories, [], 'ensure that the directory entry has no directories itself');
      QUnit.assert.deepEqual(dir.directories[0].files, [], 'ensure that the directory entry has no files itself');
      QUnit.assert.equal(dir.directories[0].parent, dir, 'ensure that the parent attribute is set correctly');
      QUnit.assert.deepEqual(dir.files, [], 'ensure that files empty');
    })
    QUnit.test('directory_wo_files_w_muliple_sub_directories', function() {
      var dir = new DirectoryBuilder('/').setDirectories([
        new DirectoryBuilder('home').build(),
        new DirectoryBuilder('projects').build()
      ]).setFiles([]).build()
      QUnit.assert.equal(dir.name, '/', 'ensure that name is set');
      QUnit.assert.deepEqual(dir.files, [], 'ensure that files empty');
      QUnit.assert.equal(dir.directories.length, 2, 'ensure that directories has a single entry');

      QUnit.assert.equal(dir.directories[0].name, 'home', 'ensure that the directory entry name is correct');
      QUnit.assert.equal(dir.directories[0].parent, dir, 'ensure that the parent attribute is set correctly');
      QUnit.assert.deepEqual(dir.directories[0].directories, [], 'ensure that the directory entry has no directories itself');
      QUnit.assert.deepEqual(dir.directories[0].files, [], 'ensure that the directory entry has no files itself');

      QUnit.assert.equal(dir.directories[1].name, 'projects', 'ensure that the directory entry name is correct');
      QUnit.assert.equal(dir.directories[1].parent, dir, 'ensure that the parent attribute is set correctly');
      QUnit.assert.deepEqual(dir.directories[1].directories, [], 'ensure that the directory entry has no directories itself');
      QUnit.assert.deepEqual(dir.directories[1].files, [], 'ensure that the directory entry has no files itself');
    })
  });
  QUnit.module('search', function() {
    QUnit.test('root', function() {
      var dir = new DirectoryBuilder('/').build();
      var found = dir.searchDir('/')
      QUnit.assert.equal(found, dir, 'Search for the \'/\' path');
    })

    QUnit.test('one_level_down', function() {
      var dir = new DirectoryBuilder('/').setDirectories([
        new DirectoryBuilder('home').build()
      ]).build()

      var found = dir.searchDir('home')
      QUnit.assert.equal(found.name, 'home', `Search for the 'home' folder`);
    })

    QUnit.test('two_levels_down', function() {
      var dir = new DirectoryBuilder('/').setDirectories([
        new DirectoryBuilder('home').setDirectories([
          new DirectoryBuilder('projects').build()
        ]).build()
      ]).build()

      var found = dir.searchDir('projects')
      QUnit.assert.equal(found.name, 'projects', `Search for the 'projects' folder`);
    })

    QUnit.test('nonexistant_folder', function() {
      var dir = new DirectoryBuilder('/').setDirectories([
        new DirectoryBuilder('home').setDirectories([
          new DirectoryBuilder('projects').build()
        ]).build()
      ]).build()

      var found = dir.searchDir('about')
      QUnit.assert.equal(found, undefined, `Search for 'about' folder (this folder doesn't exist)`);
    })

    QUnit.test('deep_search_dir', function() {
      var dir = new DirectoryBuilder('/').setDirectories([
        new DirectoryBuilder('home').setDirectories([
          new DirectoryBuilder('1').setDirectories([
            new DirectoryBuilder('2').setDirectories([
              new DirectoryBuilder('3').setDirectories([
                new DirectoryBuilder('projects').build()
              ]).build()
            ]).build()
          ]).build()
        ]).build()
      ]).build()

      var found = dir.searchDir('projects')
      QUnit.assert.equal(found.name, 'projects', `Search for deeply nested 'projects' folder`);
    })

    QUnit.test('deep_search_dir_w_parallel_dirs_and_files', function() {
      var dir = new DirectoryBuilder('/').setDirectories([
        new DirectoryBuilder('home').setDirectories([
          new DirectoryBuilder('1').setDirectories([
            new DirectoryBuilder('2').setDirectories([
              new DirectoryBuilder('3').setDirectories([
                new DirectoryBuilder('projects').build(),
                new DirectoryBuilder('about').build()
              ]).build(),
              new DirectoryBuilder('something').build()
            ]).build()
          ]).build()
        ]).build()
      ]).build()

      var found = dir.searchDir('projects')
      QUnit.assert.equal(found.name, 'projects', `Search for deeply nested 'projects' folder`);

      var found = dir.searchDir('something')
      QUnit.assert.equal(found.name, 'something', `Search for deeply nested 'something' folder`);
    })
  });
  QUnit.module('searchpath', function() {
    QUnit.test('compound_path_exists', function() {
      var root = new DirectoryBuilder('/').setDirectories([
        new DirectoryBuilder('home').setDirectories([
          new DirectoryBuilder('projects').setFiles([ 'rflang.md' ]).build(),
          new DirectoryBuilder('aboutme').setFiles([ 'rflang.md' ]).build(),
          new DirectoryBuilder('empty').setDirectories([
            new DirectoryBuilder('subempty').setFiles([ 'notemptysike.md' ]).build(),
          ]).build()
        ]).setFiles([]).build(),
      ]).setFiles([]).build();

      var dir = root.searchPath('home/empty/subempty')
      QUnit.assert.equal(dir.name, 'subempty')
      QUnit.assert.deepEqual(dir.directories, [])
      QUnit.assert.deepEqual(dir.files, ['notemptysike.md'])
    });
    QUnit.test('compound_path_not_exists', function() {
      var root = new DirectoryBuilder('/').setDirectories([
        new DirectoryBuilder('home').setDirectories([
          new DirectoryBuilder('projects').setFiles([ 'rflang.md' ]).build(),
          new DirectoryBuilder('aboutme').setFiles([ 'rflang.md' ]).build(),
          new DirectoryBuilder('empty').setDirectories([
            new DirectoryBuilder('subempty').setFiles([ 'notemptysike.md' ]).build(),
          ]).build()
        ]).setFiles([]).build(),
      ]).setFiles([]).build();

      var dir = root.searchPath('home/empty/subempt')
      QUnit.assert.equal(dir, undefined)
    })
    QUnit.test('search_for_distance_child_dir', function() {
      var root = new DirectoryBuilder('/').setDirectories([
        new DirectoryBuilder('home').setDirectories([
          new DirectoryBuilder('projects').setFiles([ 'rflang.md' ]).build(),
          new DirectoryBuilder('aboutme').setFiles([ 'rflang.md' ]).build(),
          new DirectoryBuilder('empty').setDirectories([
            new DirectoryBuilder('subempty').setFiles([ 'notemptysike.md' ]).build(),
          ]).build()
        ]).setFiles([]).build(),
      ]).setFiles([]).build();
      
      var dir = root.searchPath('subempty')
      QUnit.assert.equal(dir, undefined)
    })
    QUnit.test('search_relative_from_root', function() {
      var root = new DirectoryBuilder('/').setDirectories([
        new DirectoryBuilder('home').setDirectories([
          new DirectoryBuilder('projects').setFiles([ 'rflang.md' ]).build(),
          new DirectoryBuilder('aboutme').setFiles([ 'rflang.md' ]).build(),
          new DirectoryBuilder('empty').setDirectories([
            new DirectoryBuilder('subempty').setFiles([ 'notemptysike.md' ]).build(),
          ]).build()
        ]).setFiles([]).build(),
      ]).setFiles([]).build();

      var dir = root.searchPath('home/projects/..')
      var realpath = dir.realpath();
      QUnit.assert.equal(realpath, '/home/')
    })
    QUnit.test('search_relative_from_root_passed_root', function() {
      var root = new DirectoryBuilder('/').setDirectories([
        new DirectoryBuilder('home').setDirectories([
          new DirectoryBuilder('projects').setFiles([ 'rflang.md' ]).build(),
          new DirectoryBuilder('aboutme').setFiles([ 'rflang.md' ]).build(),
          new DirectoryBuilder('empty').setDirectories([
            new DirectoryBuilder('subempty').setFiles([ 'notemptysike.md' ]).build(),
          ]).build()
        ]).setFiles([]).build(),
      ]).setFiles([]).build();

      var dir = root.searchPath('home/projects/../../..')
      QUnit.assert.equal(dir, undefined);
    })
  });
  QUnit.module('realpath', function() {
    QUnit.test('root', function() {
      var dir = new DirectoryBuilder('/').build();

      var realpath = dir.realpath();
      QUnit.assert.equal(realpath, '/', 'Realpath of root /')
    })

    QUnit.test('deep_realpath', function() {
      var dir = new DirectoryBuilder('/').setDirectories([
        new DirectoryBuilder('home').setDirectories([
          new DirectoryBuilder('1').setDirectories([
            new DirectoryBuilder('2').setDirectories([
              new DirectoryBuilder('3').setDirectories([
                new DirectoryBuilder('projects').build(),
                new DirectoryBuilder('about').build()
              ]).build(),
              new DirectoryBuilder('something').build()
            ]).build()
          ]).build()
        ]).build()
      ]).build()

      var found = dir.searchDir('projects')
      QUnit.assert.notEqual(found, undefined, `Search for 'projects' folder`)
      QUnit.assert.equal(found.name, 'projects', `Make sure we found the 'projects' folder`)

      var realpath = found.realpath()
      QUnit.assert.equal(realpath, '/home/1/2/3/projects/', `Realpath on deeply nested 'projects' folder`)
    })

    QUnit.test('deep_realpath2', function() {
      var dir = new DirectoryBuilder('/').setDirectories([
        new DirectoryBuilder('home').setDirectories([
          new DirectoryBuilder('1').setDirectories([
            new DirectoryBuilder('2').setDirectories([
              new DirectoryBuilder('3').setDirectories([
                new DirectoryBuilder('projects').build(),
                new DirectoryBuilder('about').build()
              ]).build(),
              new DirectoryBuilder('something').build()
            ]).build()
          ]).build()
        ]).build()
      ]).build()

      var found = dir.searchDir('something')
      QUnit.assert.notEqual(found, undefined, `Search for 'something' folder`)
      QUnit.assert.equal(found.name, 'something', `Make sure we found the 'something' folder`)

      var realpath = found.realpath()
      QUnit.assert.equal(realpath, '/home/1/2/something/', `Realpath on deeply nested 'something' folder`)
    })
  });
});
