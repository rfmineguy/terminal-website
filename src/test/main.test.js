QUnit.module('filesystem', function() {
  QUnit.module('directory', function() {
    QUnit.test('directory_empty', function() {
      var dir = new DirectoryBuilder('/').build()
      QUnit.assert.true(dir instanceof Directory, 'ensure that dir is a Directory instance');
      QUnit.assert.equal(dir.name, '/', 'ensure that name is set');
      console.log(dir)
      QUnit.assert.deepEqual(dir.children, [], 'ensure that children is empty');
    });
    QUnit.test('directory_w_files_wo_directories', function() {
      var dir = new DirectoryBuilder('/').setChildren([
        new File('test.txt', 'path'),
        new File('cool.md', 'path')
      ]).build()
      QUnit.assert.equal(dir.name, '/', 'ensure that name is set');
      QUnit.assert.equal(dir.children.length, 2, 'ensure there are two children');
      QUnit.assert.equal(dir.getFiles().length, 2, 'ensure there are two files');

      const files = dir.getFiles()
      QUnit.assert.equal(files.length, 2, 'ensure there are two files')
      const filenames = files.map(file => file.name)
      const realpaths = files.map(file => file.realpath)
      QUnit.assert.deepEqual(filenames, ['test.txt', 'cool.md'])
      QUnit.assert.deepEqual(realpaths, ['path', 'path'])
    })

    QUnit.test('directory_wo_files_w_single_sub_directory', function() {
      var dir = new DirectoryBuilder('/').setChildren([
        new DirectoryBuilder('home').build()
      ]).build()
      QUnit.assert.equal(dir.name, '/', 'ensure that name is set');
      QUnit.assert.equal(dir.children.length, 1, 'ensure that directories has a single entry');
      QUnit.assert.equal(dir.children[0].name, 'home', 'ensure that the directory entry name is correct');
      QUnit.assert.deepEqual(dir.children[0].children, [], 'ensure that the directory entry has no children itself');
      QUnit.assert.equal(dir.children[0].parent, dir, 'ensure that the parent attribute is set correctly');
    })
    QUnit.test('directory_wo_files_w_muliple_sub_directories', function() {
      var dir = new DirectoryBuilder('/').setChildren([
        new DirectoryBuilder('home').build(),
        new DirectoryBuilder('projects').build()
      ]).build()
      QUnit.assert.equal(dir.name, '/', 'ensure that name is set');
      QUnit.assert.deepEqual(dir.getFiles(), [], 'ensure that files empty');
      QUnit.assert.equal(dir.getDirectories().length, 2, 'ensure that root has a two sub directories');

      QUnit.assert.equal(dir.getDirectories()[0].name, 'home', 'ensure that the directory entry name is correct');
      QUnit.assert.equal(dir.getDirectories()[0].parent, dir, 'ensure that the parent attribute is set correctly');
      QUnit.assert.deepEqual(dir.getDirectories()[0].getDirectories(), [], 'ensure that the directory entry has no directories itself');
      QUnit.assert.deepEqual(dir.getDirectories()[0].getFiles(), [], 'ensure that the directory entry has no files itself');

      QUnit.assert.equal(dir.getDirectories()[1].name, 'projects', 'ensure that the directory entry name is correct');
      QUnit.assert.equal(dir.getDirectories()[1].parent, dir, 'ensure that the parent attribute is set correctly');
      QUnit.assert.deepEqual(dir.children[1].getDirectories(), [], 'ensure that the directory entry has no directories itself');
      QUnit.assert.deepEqual(dir.children[1].getFiles(), [], 'ensure that the directory entry has no files itself');
    })
  });
  QUnit.module('searchdir', function() {
    QUnit.test('root', function() {
      var dir = new DirectoryBuilder('/').build();
      var found = dir.searchDir('/')
      QUnit.assert.equal(found, dir, 'Search for the \'/\' path');
    })

    QUnit.test('one_level_down', function() {
      var dir = new DirectoryBuilder('/').setChildren([
        new DirectoryBuilder('home').build()
      ]).build()

      var found = dir.searchDir('home')
      QUnit.assert.equal(found.name, 'home', `Search for the 'home' folder`);
    })

    QUnit.test('two_levels_down', function() {
      var dir = new DirectoryBuilder('/').setChildren([
        new DirectoryBuilder('home').setChildren([
          new DirectoryBuilder('projects').build()
        ]).build()
      ]).build()

      var found = dir.searchDir('projects')
      QUnit.assert.equal(found.name, 'projects', `Search for the 'projects' folder`);
    })

    QUnit.test('nonexistant_folder', function() {
      var dir = new DirectoryBuilder('/').setChildren([
        new DirectoryBuilder('home').setChildren([
          new DirectoryBuilder('projects').build()
        ]).build()
      ]).build()

      var found = dir.searchDir('about')
      QUnit.assert.equal(found, undefined, `Search for 'about' folder (this folder doesn't exist)`);
    })

    QUnit.test('deep_search_dir', function() {
      var dir = new DirectoryBuilder('/').setChildren([
        new DirectoryBuilder('home').setChildren([
          new DirectoryBuilder('1').setChildren([
            new DirectoryBuilder('2').setChildren([
              new DirectoryBuilder('3').setChildren([
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
      var dir = new DirectoryBuilder('/').setChildren([
        new DirectoryBuilder('home').setChildren([
          new DirectoryBuilder('1').setChildren([
            new DirectoryBuilder('2').setChildren([
              new DirectoryBuilder('3').setChildren([
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
    QUnit.module('directory', function() {
      QUnit.test('compound_path_exists', function() {
        var root = new DirectoryBuilder('/').setChildren([
          new DirectoryBuilder('home').setChildren([
            new DirectoryBuilder('projects').setChildren(new File('rflang.md', '')).build(),
            new DirectoryBuilder('aboutme').setChildren(new File('rflang.md', '')).build(),
            new DirectoryBuilder('empty').setChildren([
              new DirectoryBuilder('subempty').setChildren([new File('notemptysike.md', '')]).build(),
            ]).build()
          ]).build(),
        ]).build();

        var dir = root.searchPath('home/empty/subempty')
        QUnit.assert.equal(dir.name, 'subempty', 'check name of returned dir')
        QUnit.assert.deepEqual(dir.getDirectories(), [])

        const files = dir.getFiles()
        QUnit.assert.equal(files.length, 1, 'ensure there is one file')

        const filenames = files.map(file => file.name)
        const realpaths = files.map(file => file.realpath)
        QUnit.assert.deepEqual(filenames, ['notemptysike.md'])
        QUnit.assert.deepEqual(realpaths, [''])
      });
      QUnit.test('compound_path_not_exists', function() {
        var root = new DirectoryBuilder('/').setChildren([
          new DirectoryBuilder('home').setChildren([
            new DirectoryBuilder('projects').setChildren([ new File('rflang.md', '') ]).build(),
            new DirectoryBuilder('aboutme').setChildren([ new File('rflang.md', '') ]).build(),
            new DirectoryBuilder('empty').setChildren([
              new DirectoryBuilder('subempty').setChildren([new File('notemptysike.md', '')]).build(),
            ]).build()
          ]).build(),
        ]).build();

        var dir = root.searchPath('home/empty/subempt')
        QUnit.assert.equal(dir, undefined)
      })
      QUnit.test('search_for_distance_child_dir', function() {
        var root = new DirectoryBuilder('/').setChildren([
          new DirectoryBuilder('home').setChildren([
            new DirectoryBuilder('projects').setChildren([new File('rflang.md', '')]).build(),
            new DirectoryBuilder('aboutme').setChildren([new File('rflang.md', '')]).build(),
            new DirectoryBuilder('empty').setChildren([
              new DirectoryBuilder('subempty').setChildren([new File('notemptysike.md', '')]).build(),
            ]).build()
          ]).build(),
        ]).build();
        
        var dir = root.searchPath('subempty')
        QUnit.assert.equal(dir, undefined)
      })
      QUnit.test('search_relative_from_root', function() {
        var root = new DirectoryBuilder('/').setChildren([
          new DirectoryBuilder('home').setChildren([
            new DirectoryBuilder('projects').setChildren([new File('rflang.md', '')]).build(),
            new DirectoryBuilder('aboutme').setChildren([new File('rflang.md', '')]).build(),
            new DirectoryBuilder('empty').setChildren([
              new DirectoryBuilder('subempty').setChildren([new File('notemptysike.md', '')]).build(),
            ]).build()
          ]).build(),
        ]).build();

        var dir = root.searchPath('home/projects/..')
        var realpath = dir.realpath();
        QUnit.assert.equal(realpath, '/home/')
      })
      QUnit.test('search_relative_from_root_passed_root', function() {
        var root = new DirectoryBuilder('/').setChildren([
          new DirectoryBuilder('home').setChildren([
            new DirectoryBuilder('projects').setChildren([new File('rflang.md', '')]).build(),
            new DirectoryBuilder('aboutme').setChildren([new File('rflang.md', '')]).build(),
            new DirectoryBuilder('empty').setChildren([
              new DirectoryBuilder('subempty').setChildren([new File('notemptysike.md', '')]).build(),
            ]).build()
          ]).build(),
        ]).build();

        var dir = root.searchPath('home/projects/../../..')
        QUnit.assert.equal(dir, undefined);
      })
    })
    QUnit.module('file', function() {
      QUnit.test('search_file_in_root', function() {
        var root = new DirectoryBuilder('/').setChildren([
          new File('easter_egg', ''),
          new DirectoryBuilder('home').setChildren([
            new DirectoryBuilder('projects').setChildren([new File('rflang.md', '')]).build(),
            new DirectoryBuilder('aboutme').setChildren([new File('rflang.md', '')]).build(),
            new DirectoryBuilder('empty').setChildren([
              new DirectoryBuilder('subempty').setChildren([new File('notemptysike.md', '')]).build(),
            ]).build()
          ]).build(),
        ]).build();

        var f = root.searchPath('easter_egg', true)
        QUnit.assert.notEqual(f, undefined, 'search for file in root')
        QUnit.assert.equal(f.name, 'easter_egg', 'check if file is correct file')
      })
      QUnit.test('search_file_in_deep_path', function() {
        var root = new DirectoryBuilder('/').setChildren([
          new File('easter_egg', ''),
          new DirectoryBuilder('home').setChildren([
            new DirectoryBuilder('projects').setChildren([new File('rflang.md', '')]).build(),
            new DirectoryBuilder('aboutme').setChildren([new File('rflang.md', '')]).build(),
            new DirectoryBuilder('empty').setChildren([
              new DirectoryBuilder('subempty').setChildren([new File('notemptysike.md', '')]).build(),
            ]).build()
          ]).build(),
        ]).build();

        var f = root.searchPath('home/projects/rflang.md', true)
        QUnit.assert.notEqual(f, undefined, 'search for home/projects/rflang.md')
        QUnit.assert.equal(f.name, 'rflang.md', 'check if file is correct file')

        var f = root.searchPath('home/aboutme/rflang.md', true)
        QUnit.assert.notEqual(f, undefined, 'search for home/aboutme/rflang.md')
        QUnit.assert.equal(f.name, 'rflang.md', 'check if file is correct file')

        var f = root.searchPath('home/empty/subempty/notemptysike.md', true)
        QUnit.assert.notEqual(f, undefined, 'search for home/empty/subempty/notemptysike.md')
        QUnit.assert.equal(f.name, 'notemptysike.md', 'check if file is correct file')
      })
    })
  });
  QUnit.module('realpath', function() {
    QUnit.test('root', function() {
      var dir = new DirectoryBuilder('/').build();

      var realpath = dir.realpath();
      QUnit.assert.equal(realpath, '/', 'Realpath of root /')
    })

    QUnit.test('deep_realpath', function() {
      var dir = new DirectoryBuilder('/').setChildren([
        new DirectoryBuilder('home').setChildren([
          new DirectoryBuilder('1').setChildren([
            new DirectoryBuilder('2').setChildren([
              new DirectoryBuilder('3').setChildren([
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
      var dir = new DirectoryBuilder('/').setChildren([
        new DirectoryBuilder('home').setChildren([
          new DirectoryBuilder('1').setChildren([
            new DirectoryBuilder('2').setChildren([
              new DirectoryBuilder('3').setChildren([
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
