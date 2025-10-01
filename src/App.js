import React, { useState } from 'react';
import { Plus, Trash2, Download, Calendar, Users, MapPin, Clock, FileText, Table } from 'lucide-react';

const MovieScheduler = () => {
  const [scenes, setScenes] = useState([
    {
      id: 1,
      number: '1',
      name: 'Coffee Shop - Morning',
      location: 'Coffee Shop',
      intExt: 'INT',
      dayNight: 'DAY',
      pages: '2 3/8',
      cast: ['Sarah', 'Mike'],
      props: ['Coffee cups', 'Laptop'],
      wardrobe: ['Business casual'],
      color: 'bg-yellow-400',
      scheduled: false,
      shootDay: null
    },
    {
      id: 2,
      number: '2',
      name: 'Office - Afternoon',
      location: 'Office',
      intExt: 'INT',
      dayNight: 'DAY',
      pages: '1 1/2',
      cast: ['Sarah', 'Boss'],
      props: ['Files', 'Phone'],
      wardrobe: ['Business suit'],
      color: 'bg-blue-400',
      scheduled: false,
      shootDay: null
    }
  ]);

  const [activeTab, setActiveTab] = useState('breakdown');
  
  const deleteShootDay = (dayId) => {
    const day = schedule.find(d => d.id === dayId);
    if (day) {
      day.scenes.forEach(scene => {
        setScenes(scenes.map(s => 
          s.id === scene.id ? { ...s, scheduled: false, shootDay: null } : s
        ));
      });
    }
    setSchedule(schedule.filter(d => d.id !== dayId));
  };
  const [schedule, setSchedule] = useState([]);
  const [newScene, setNewScene] = useState({
    number: '',
    name: '',
    location: '',
    intExt: 'INT',
    dayNight: 'DAY',
    pages: '',
    cast: '',
    props: '',
    wardrobe: ''
  });

  const sceneColors = [
    { name: 'Yellow (Day INT)', color: 'bg-yellow-400' },
    { name: 'White (Day EXT)', color: 'bg-white border-2 border-gray-300' },
    { name: 'Blue (Night INT)', color: 'bg-blue-400' },
    { name: 'Green (Night EXT)', color: 'bg-green-400' },
    { name: 'Orange (Dusk/Dawn)', color: 'bg-orange-400' },
    { name: 'Pink (Special)', color: 'bg-pink-400' }
  ];

  const getSceneColor = (intExt, dayNight) => {
    if (intExt === 'INT' && dayNight === 'DAY') return 'bg-yellow-400';
    if (intExt === 'EXT' && dayNight === 'DAY') return 'bg-white border-2 border-gray-300';
    if (intExt === 'INT' && dayNight === 'NIGHT') return 'bg-blue-400';
    if (intExt === 'EXT' && dayNight === 'NIGHT') return 'bg-green-400';
    return 'bg-gray-400';
  };

  const addScene = () => {
    if (newScene.number && newScene.name) {
      const scene = {
        id: Date.now(),
        ...newScene,
        cast: newScene.cast.split(',').map(c => c.trim()).filter(c => c),
        props: newScene.props.split(',').map(p => p.trim()).filter(p => p),
        wardrobe: newScene.wardrobe.split(',').map(w => w.trim()).filter(w => w),
        color: getSceneColor(newScene.intExt, newScene.dayNight),
        scheduled: false,
        shootDay: null
      };
      setScenes([...scenes, scene]);
      setNewScene({
        number: '',
        name: '',
        location: '',
        intExt: 'INT',
        dayNight: 'DAY',
        pages: '',
        cast: '',
        props: '',
        wardrobe: ''
      });
    }
  };

  const deleteScene = (id) => {
    setScenes(scenes.filter(s => s.id !== id));
    setSchedule(schedule.map(day => ({
      ...day,
      scenes: day.scenes.filter(s => s.id !== id)
    })));
  };

  const addShootDay = () => {
    setSchedule([...schedule, {
      id: Date.now(),
      dayNumber: schedule.length + 1,
      date: '',
      scenes: []
    }]);
  };

  const addSceneToDay = (sceneId, dayId) => {
    const scene = scenes.find(s => s.id === sceneId);
    if (!scene) return;

    setSchedule(schedule.map(day => {
      if (day.id === dayId) {
        if (!day.scenes.find(s => s.id === sceneId)) {
          return { ...day, scenes: [...day.scenes, scene] };
        }
      }
      return day;
    }));

    setScenes(scenes.map(s => 
      s.id === sceneId ? { ...s, scheduled: true, shootDay: dayId } : s
    ));
  };

  const removeSceneFromDay = (sceneId, dayId) => {
    setSchedule(schedule.map(day => {
      if (day.id === dayId) {
        return { ...day, scenes: day.scenes.filter(s => s.id !== sceneId) };
      }
      return day;
    }));

    setScenes(scenes.map(s => 
      s.id === sceneId ? { ...s, scheduled: false, shootDay: null } : s
    ));
  };

  const moveSceneInDay = (dayId, fromIndex, toIndex) => {
    setSchedule(schedule.map(day => {
      if (day.id === dayId) {
        const newScenes = [...day.scenes];
        const [moved] = newScenes.splice(fromIndex, 1);
        newScenes.splice(toIndex, 0, moved);
        return { ...day, scenes: newScenes };
      }
      return day;
    }));
  };

  const handleDragStart = (e, scene) => {
    e.dataTransfer.setData('sceneId', scene.id.toString());
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, dayId) => {
    e.preventDefault();
    const sceneId = parseInt(e.dataTransfer.getData('sceneId'));
    if (sceneId) {
      addSceneToDay(sceneId, dayId);
    }
  };

  const getAllCast = () => {
    const castSet = new Set();
    scenes.forEach(scene => {
      scene.cast.forEach(member => castSet.add(member));
    });
    return Array.from(castSet);
  };

  const getAllLocations = () => {
    const locationMap = new Map();
    scenes.forEach(scene => {
      const key = scene.location;
      if (!locationMap.has(key)) {
        locationMap.set(key, {
          location: scene.location,
          intExt: scene.intExt,
          scenes: []
        });
      }
      locationMap.get(key).scenes.push(scene);
    });
    return Array.from(locationMap.values());
  };

  const getAllProps = () => {
    const propsMap = new Map();
    scenes.forEach(scene => {
      scene.props.forEach(prop => {
        if (!propsMap.has(prop)) {
          propsMap.set(prop, []);
        }
        propsMap.get(prop).push(scene);
      });
    });
    return Array.from(propsMap.entries()).map(([prop, scenes]) => ({ prop, scenes }));
  };

  const getAllWardrobe = () => {
    const wardrobeMap = new Map();
    scenes.forEach(scene => {
      scene.wardrobe.forEach(item => {
        if (!wardrobeMap.has(item)) {
          wardrobeMap.set(item, []);
        }
        wardrobeMap.get(item).push(scene);
      });
    });
    return Array.from(wardrobeMap.entries()).map(([item, scenes]) => ({ item, scenes }));
  };

  const generateDayOutOfDays = () => {
    const cast = getAllCast();
    const dood = cast.map(member => {
      const days = schedule.map(day => {
        const working = day.scenes.some(scene => scene.cast.includes(member));
        return working ? 'W' : '-';
      });
      return { member, days };
    });
    return dood;
  };

  const exportSchedule = () => {
    const data = {
      projectName: 'Production Schedule',
      exportDate: new Date().toISOString(),
      scenes,
      schedule,
      dayOutOfDays: generateDayOutOfDays(),
      locations: getAllLocations(),
      props: getAllProps(),
      wardrobe: getAllWardrobe()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `production-schedule-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const exportToCSV = () => {
    let csv = 'Scene,Name,Location,INT/EXT,DAY/NIGHT,Pages,Cast,Props,Wardrobe,Shoot Day\n';
    
    scenes.forEach(scene => {
      const shootDay = schedule.find(day => 
        day.scenes.some(s => s.id === scene.id)
      );
      csv += `"${scene.number}","${scene.name}","${scene.location}","${scene.intExt}","${scene.dayNight}","${scene.pages}","${scene.cast.join('; ')}","${scene.props.join('; ')}","${scene.wardrobe.join('; ')}","${shootDay ? 'Day ' + shootDay.dayNumber : 'Unscheduled'}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scene-breakdown-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const exportToPDF = () => {
    let htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Production Schedule</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          h1 { color: #333; border-bottom: 3px solid #333; padding-bottom: 10px; }
          h2 { color: #555; margin-top: 30px; border-bottom: 2px solid #555; padding-bottom: 5px; }
          h3 { color: #666; margin-top: 20px; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; font-weight: bold; }
          .scene-strip { padding: 10px; margin: 10px 0; border-radius: 5px; }
          .day-int { background-color: #fef3c7; }
          .day-ext { background-color: #f3f4f6; }
          .night-int { background-color: #bfdbfe; }
          .night-ext { background-color: #bbf7d0; }
          .page-break { page-break-after: always; }
          .metadata { color: #666; font-size: 12px; margin-bottom: 20px; }
        </style>
      </head>
      <body>
        <h1>Production Schedule</h1>
        <div class="metadata">
          <p>Generated: ${new Date().toLocaleString()}</p>
          <p>Total Scenes: ${scenes.length} | Shoot Days: ${schedule.length}</p>
        </div>
    `;

    // Shooting Schedule
    htmlContent += '<h2>Shooting Schedule</h2>';
    schedule.forEach(day => {
      htmlContent += `<h3>Day ${day.dayNumber}${day.date ? ' - ' + new Date(day.date).toLocaleDateString() : ''}</h3>`;
      htmlContent += '<table><thead><tr><th>Scene</th><th>Description</th><th>D/N</th><th>Pages</th><th>Cast</th></tr></thead><tbody>';
      day.scenes.forEach(scene => {
        htmlContent += `<tr>
          <td>${scene.number}</td>
          <td>${scene.intExt} ${scene.location} - ${scene.name}</td>
          <td>${scene.dayNight}</td>
          <td>${scene.pages}</td>
          <td>${scene.cast.join(', ')}</td>
        </tr>`;
      });
      htmlContent += '</tbody></table>';
    });

    // Day Out of Days
    htmlContent += '<div class="page-break"></div><h2>Day Out of Days</h2>';
    const dood = generateDayOutOfDays();
    if (dood.length > 0) {
      htmlContent += '<table><thead><tr><th>Cast Member</th>';
      schedule.forEach(day => {
        htmlContent += `<th>Day ${day.dayNumber}</th>`;
      });
      htmlContent += '</tr></thead><tbody>';
      dood.forEach(row => {
        htmlContent += `<tr><td><strong>${row.member}</strong></td>`;
        row.days.forEach(status => {
          htmlContent += `<td style="text-align: center; ${status === 'W' ? 'background-color: #bbf7d0; font-weight: bold;' : ''}">${status}</td>`;
        });
        htmlContent += '</tr>';
      });
      htmlContent += '</tbody></table>';
    }

    // Scene Breakdown
    htmlContent += '<div class="page-break"></div><h2>Complete Scene Breakdown</h2>';
    scenes.forEach(scene => {
      const sceneClass = scene.intExt === 'INT' && scene.dayNight === 'DAY' ? 'day-int' :
                         scene.intExt === 'EXT' && scene.dayNight === 'DAY' ? 'day-ext' :
                         scene.intExt === 'INT' && scene.dayNight === 'NIGHT' ? 'night-int' : 'night-ext';
      htmlContent += `
        <div class="scene-strip ${sceneClass}">
          <strong>Scene ${scene.number}</strong>: ${scene.name}<br>
          <strong>Location:</strong> ${scene.location} (${scene.intExt}/${scene.dayNight})<br>
          <strong>Pages:</strong> ${scene.pages}<br>
          <strong>Cast:</strong> ${scene.cast.join(', ')}<br>
          <strong>Props:</strong> ${scene.props.join(', ')}<br>
          <strong>Wardrobe:</strong> ${scene.wardrobe.join(', ')}
        </div>
      `;
    });

    htmlContent += '</body></html>';

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const newWindow = window.open(url);
    
    if (newWindow) {
      newWindow.onload = () => {
        setTimeout(() => {
          newWindow.print();
        }, 250);
      };
    }
  };

  const importSchedule = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          if (data.scenes) setScenes(data.scenes);
          if (data.schedule) setSchedule(data.schedule);
          alert('Schedule imported successfully!');
        } catch (error) {
          alert('Error importing file. Please make sure it\'s a valid JSON file.');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Film Production Scheduler</h1>
              <p className="text-gray-600">Break down your script, schedule scenes, and track cast</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={exportSchedule}
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 flex items-center gap-2"
                title="Export complete project as JSON"
              >
                <Download size={20} /> Export JSON
              </button>
              <button
                onClick={exportToCSV}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
                title="Export scene breakdown as CSV"
              >
                <Table size={20} /> Export CSV
              </button>
              <button
                onClick={exportToPDF}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 flex items-center gap-2"
                title="Print/Save as PDF"
              >
                <FileText size={20} /> Print PDF
              </button>
              <label className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-2 cursor-pointer" title="Import saved project">
                <Plus size={20} /> Import
                <input
                  type="file"
                  accept=".json"
                  onChange={importSchedule}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('breakdown')}
                className={`px-6 py-3 font-medium ${activeTab === 'breakdown' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Script Breakdown
              </button>
              <button
                onClick={() => setActiveTab('stripboard')}
                className={`px-6 py-3 font-medium ${activeTab === 'stripboard' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Stripboard
              </button>
              <button
                onClick={() => setActiveTab('dood')}
                className={`px-6 py-3 font-medium ${activeTab === 'dood' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Day Out of Days
              </button>
              <button
                onClick={() => setActiveTab('oneliner')}
                className={`px-6 py-3 font-medium ${activeTab === 'oneliner' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                One-Liner
              </button>
              <button
                onClick={() => setActiveTab('locations')}
                className={`px-6 py-3 font-medium ${activeTab === 'locations' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Locations
              </button>
              <button
                onClick={() => setActiveTab('props')}
                className={`px-6 py-3 font-medium ${activeTab === 'props' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Props
              </button>
              <button
                onClick={() => setActiveTab('wardrobe')}
                className={`px-6 py-3 font-medium ${activeTab === 'wardrobe' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Wardrobe
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'breakdown' && (
              <div>
                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-4">Add New Scene</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <input
                      type="text"
                      placeholder="Scene #"
                      value={newScene.number}
                      onChange={(e) => setNewScene({...newScene, number: e.target.value})}
                      className="border rounded px-3 py-2"
                    />
                    <input
                      type="text"
                      placeholder="Scene Name"
                      value={newScene.name}
                      onChange={(e) => setNewScene({...newScene, name: e.target.value})}
                      className="border rounded px-3 py-2 col-span-2"
                    />
                    <input
                      type="text"
                      placeholder="Pages"
                      value={newScene.pages}
                      onChange={(e) => setNewScene({...newScene, pages: e.target.value})}
                      className="border rounded px-3 py-2"
                    />
                    <input
                      type="text"
                      placeholder="Location"
                      value={newScene.location}
                      onChange={(e) => setNewScene({...newScene, location: e.target.value})}
                      className="border rounded px-3 py-2 col-span-2"
                    />
                    <select
                      value={newScene.intExt}
                      onChange={(e) => setNewScene({...newScene, intExt: e.target.value})}
                      className="border rounded px-3 py-2"
                    >
                      <option value="INT">INT</option>
                      <option value="EXT">EXT</option>
                    </select>
                    <select
                      value={newScene.dayNight}
                      onChange={(e) => setNewScene({...newScene, dayNight: e.target.value})}
                      className="border rounded px-3 py-2"
                    >
                      <option value="DAY">DAY</option>
                      <option value="NIGHT">NIGHT</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Cast (comma separated)"
                      value={newScene.cast}
                      onChange={(e) => setNewScene({...newScene, cast: e.target.value})}
                      className="border rounded px-3 py-2 col-span-2"
                    />
                    <input
                      type="text"
                      placeholder="Props (comma separated)"
                      value={newScene.props}
                      onChange={(e) => setNewScene({...newScene, props: e.target.value})}
                      className="border rounded px-3 py-2 col-span-2"
                    />
                    <input
                      type="text"
                      placeholder="Wardrobe (comma separated)"
                      value={newScene.wardrobe}
                      onChange={(e) => setNewScene({...newScene, wardrobe: e.target.value})}
                      className="border rounded px-3 py-2 col-span-2"
                    />
                  </div>
                  <button
                    onClick={addScene}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Plus size={20} /> Add Scene
                  </button>
                </div>

                <h2 className="text-xl font-bold mb-4">Scene Breakdown</h2>
                <div className="space-y-3">
                  {scenes.map(scene => (
                    <div key={scene.id} className={`${scene.color} rounded-lg p-4 shadow`}>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-bold text-lg">Scene {scene.number}</span>
                            <span className="font-semibold">{scene.name}</span>
                            <span className="text-sm bg-white bg-opacity-50 px-2 py-1 rounded">{scene.pages} pgs</span>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                            <div className="flex items-center gap-1">
                              <MapPin size={16} />
                              <span>{scene.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock size={16} />
                              <span>{scene.intExt} / {scene.dayNight}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users size={16} />
                              <span>{scene.cast.join(', ')}</span>
                            </div>
                            <div>
                              <span className="font-semibold">Props:</span> {scene.props.join(', ')}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => deleteScene(scene.id)}
                          className="text-red-600 hover:text-red-800 ml-4"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'stripboard' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Shooting Schedule</h2>
                  <button
                    onClick={addShootDay}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-2"
                  >
                    <Plus size={20} /> Add Shoot Day
                  </button>
                </div>

                <div className="mb-6 p-4 bg-gray-100 rounded">
                  <h3 className="font-semibold mb-2">Unscheduled Scenes (Drag to Schedule)</h3>
                  <div className="flex flex-wrap gap-2">
                    {scenes.filter(s => !s.scheduled).map(scene => (
                      <div
                        key={scene.id}
                        className={`${scene.color} px-3 py-2 rounded shadow text-sm cursor-move hover:shadow-lg transition-shadow`}
                        draggable
                        onDragStart={(e) => handleDragStart(e, scene)}
                      >
                        <div className="font-semibold">Scene {scene.number}</div>
                        <div className="text-xs">{scene.name}</div>
                      </div>
                    ))}
                    {scenes.filter(s => !s.scheduled).length === 0 && (
                      <p className="text-gray-500 text-sm">All scenes scheduled!</p>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  {schedule.map(day => (
                    <div 
                      key={day.id} 
                      className="border-2 border-gray-300 rounded-lg p-4 hover:border-blue-400 transition-colors"
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, day.id)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-4">
                          <h3 className="font-bold text-lg">Day {day.dayNumber}</h3>
                          <input
                            type="date"
                            value={day.date}
                            onChange={(e) => setSchedule(schedule.map(d => 
                              d.id === day.id ? {...d, date: e.target.value} : d
                            ))}
                            className="border rounded px-2 py-1"
                          />
                          <select
                            onChange={(e) => {
                              if (e.target.value) {
                                addSceneToDay(parseInt(e.target.value), day.id);
                                e.target.value = '';
                              }
                            }}
                            className="border rounded px-2 py-1"
                          >
                            <option value="">Add scene...</option>
                            {scenes.filter(s => !s.scheduled).map(scene => (
                              <option key={scene.id} value={scene.id}>
                                Scene {scene.number}: {scene.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <button
                          onClick={() => deleteShootDay(day.id)}
                          className="text-red-600 hover:text-red-800 flex items-center gap-1"
                        >
                          <Trash2 size={18} />
                          Delete Day
                        </button>
                      </div>
                      <div className="space-y-2 min-h-[60px] bg-gray-50 rounded p-2">
                        {day.scenes.length === 0 ? (
                          <div className="text-gray-400 text-center py-4 text-sm">
                            Drop scenes here or use the dropdown above
                          </div>
                        ) : (
                          day.scenes.map((scene, idx) => (
                            <div
                              key={scene.id}
                              className={`${scene.color} p-3 rounded flex justify-between items-center shadow-sm hover:shadow-md transition-shadow`}
                            >
                              <div>
                                <span className="font-bold">Scene {scene.number}</span>: {scene.name} 
                                <span className="ml-2 text-sm">({scene.intExt}/{scene.dayNight})</span>
                                <span className="ml-2 text-sm">{scene.pages} pgs</span>
                              </div>
                              <button
                                onClick={() => removeSceneFromDay(scene.id, day.id)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'dood' && (
              <div>
                <h2 className="text-xl font-bold mb-4">Day Out of Days</h2>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="border p-2 text-left">Cast Member</th>
                        {schedule.map(day => (
                          <th key={day.id} className="border p-2 text-center">
                            Day {day.dayNumber}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {generateDayOutOfDays().map((row, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50' : ''}>
                          <td className="border p-2 font-semibold">{row.member}</td>
                          {row.days.map((status, dayIdx) => (
                            <td
                              key={dayIdx}
                              className={`border p-2 text-center ${status === 'W' ? 'bg-green-200 font-bold' : ''}`}
                            >
                              {status}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'oneliner' && (
              <div>
                <h2 className="text-xl font-bold mb-4">One-Liner Schedule</h2>
                <div className="space-y-4">
                  {schedule.map(day => (
                    <div key={day.id} className="border rounded-lg p-4">
                      <h3 className="font-bold text-lg mb-2">Day {day.dayNumber} {day.date && `- ${day.date}`}</h3>
                      <table className="w-full text-sm">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="text-left p-2">Scene</th>
                            <th className="text-left p-2">Description</th>
                            <th className="text-left p-2">D/N</th>
                            <th className="text-left p-2">Pages</th>
                            <th className="text-left p-2">Cast</th>
                          </tr>
                        </thead>
                        <tbody>
                          {day.scenes.map(scene => (
                            <tr key={scene.id} className="border-t">
                              <td className="p-2 font-semibold">{scene.number}</td>
                              <td className="p-2">{scene.intExt} {scene.location} - {scene.name}</td>
                              <td className="p-2">{scene.dayNight}</td>
                              <td className="p-2">{scene.pages}</td>
                              <td className="p-2">{scene.cast.join(', ')}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'locations' && (
              <div>
                <h2 className="text-xl font-bold mb-4">Location Breakdown</h2>
                <div className="space-y-4">
                  {getAllLocations().map((loc, idx) => (
                    <div key={idx} className="border rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <MapPin className="text-blue-600" size={24} />
                        <h3 className="font-bold text-lg">{loc.location}</h3>
                        <span className="text-sm bg-gray-200 px-2 py-1 rounded">{loc.intExt}</span>
                        <span className="text-sm text-gray-600">{loc.scenes.length} scene(s)</span>
                      </div>
                      <div className="ml-9 space-y-2">
                        {loc.scenes.map(scene => (
                          <div key={scene.id} className={`${scene.color} p-2 rounded text-sm`}>
                            <span className="font-semibold">Scene {scene.number}</span>: {scene.name} ({scene.dayNight})
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'props' && (
              <div>
                <h2 className="text-xl font-bold mb-4">Props List</h2>
                <div className="space-y-3">
                  {getAllProps().map((propData, idx) => (
                    <div key={idx} className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 bg-purple-500 rounded"></div>
                        <h3 className="font-bold">{propData.prop}</h3>
                        <span className="text-sm text-gray-600">({propData.scenes.length} scene(s))</span>
                      </div>
                      <div className="ml-5 text-sm text-gray-700">
                        Scenes: {propData.scenes.map(s => s.number).join(', ')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'wardrobe' && (
              <div>
                <h2 className="text-xl font-bold mb-4">Wardrobe List</h2>
                <div className="space-y-3">
                  {getAllWardrobe().map((wardrobeData, idx) => (
                    <div key={idx} className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 bg-pink-500 rounded"></div>
                        <h3 className="font-bold">{wardrobeData.item}</h3>
                        <span className="text-sm text-gray-600">({wardrobeData.scenes.length} scene(s))</span>
                      </div>
                      <div className="ml-5 text-sm text-gray-700">
                        Scenes: {wardrobeData.scenes.map(s => s.number).join(', ')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieScheduler;