var widthRange = {'test' : 'lol'};
for (var key in widthRange) {
    if (key === 'length' || !widthRange.hasOwnProperty(key)) continue;
    var value = widthRange[key];
    console.log(key);
}