
'use strict';

const planLayers = [];
const planviewCount = [];
const markerLayers = [];

const loadingModal = document.getElementById('loadingModal');
let center_lat = 0;
let center_lon = 0;
let opacity = 1.0;

const map = new ol.Map({
target: 'map',
layers: [
new ol.layer.Tile({
    source: new ol.source.XYZ({
        projection : 'EPSG:3857',
        url : 'https://xdworld.vworld.kr/2d/Satellite/service/{z}/{x}/{y}.jpeg',
        crossOrigin: 'anonymous'
    }),
    id: 'vworld_satellite',
    visible: true
})
],

view: new ol.View({
    center: ol.proj.transform([126.660509954,37.540375191], 'EPSG:4326','EPSG:3857'),
    zoom:17
}),
});

const markerimg = new ol.style.Icon({
    anchor: [0.5, 1], // 이미지 앵커 위치
    src: 'https://cdn-icons-png.flaticon.com/512/684/684908.png', // 마커 이미지 URL
    scale: 0.06 // 크기 조정
})



export function moveview(lat,log) {

    center_lat = lat*1.0;
    center_lon = log*1.0;
    SetViewCenter();
}

homeButton.addEventListener('click', function(e) {
    SetViewCenter();
});

function SetViewCenter()
{
    const center = ol.proj.transform([center_lon,center_lat], 'EPSG:4326','EPSG:3857');
    map.getView().setCenter(center); // 지도 시점 변경
    map.getView().setZoom(18); // 줌 레벨 설
}


export function Removeplanview(index)
{
    index = index*1;
    for(let i = 0 ; i < planLayers[index].length;i++)
    {
        map.removeLayer(planLayers[index][i]);
    }
    planLayers[index].length = 0;

}


export function addplanview(image,minLat,minLon,maxLat,maxLon,index) {

    const base64Image = image;
    minLat = minLat*1.0;
    minLon = minLon*1.0;
    maxLat = maxLat*1.0;
    maxLon = maxLon*1.0;

    index = index*1;

    const min = new ol.proj.transform([minLon,minLat], 'EPSG:4326','EPSG:3857');
    const max = new ol.proj.transform([maxLon,maxLat], 'EPSG:4326','EPSG:3857');
    const imageExtent2 = [min[0],min[1],max[0],max[1]];

    const imageLayer = new ol.layer.Image({ //png파일, jpeg파일 
        source : new ol.source.ImageStatic({
            url : `data:image/png;base64,${base64Image}`, 
            imageExtent: imageExtent2,
            projection : "EPSG:3857",
        }),
        opacity:opacity,
        zIndex:0
    });

    planLayers[index].push(imageLayer);

    if(planLayers[index].length == planviewCount[index])
    {
        for(let i = 0 ; i < planLayers[index].length;i++)
        {
            map.addLayer(planLayers[index][i]);
        }
    }
}


export function addplanview_ani(image,minLat,minLon,maxLat,maxLon,index) {

    const base64Image = image;
    const min = new ol.proj.transform([minLon,minLat], 'EPSG:4326','EPSG:3857');
    const max = new ol.proj.transform([maxLon,maxLat], 'EPSG:4326','EPSG:3857');
    const imageExtent2 = [min[0],min[1],max[0],max[1]];

    const imageLayer = new ol.layer.Image({ //png파일, jpeg파일 
        source : new ol.source.ImageStatic({
            url : `data:image/png;base64,${base64Image}`, 
            imageExtent: imageExtent2,
            projection : "EPSG:3857",
        }),
        opacity:opacity,
        zIndex:0
    });

    planLayers[index].push(imageLayer);

    if(planLayers[index].length == planviewCount[index])
    {
        aniCount++;
        for(let i = 0 ; i < planLayers[index].length;i++)
        {
            map.addLayer(planLayers[index][i]);
        }

        if(aniCount == aniMaxCount)
        {
            console.log('ani_end');
            window.chrome.webview.postMessage('d');
        }
    }
}



export function setplanviewCount(count, count2) {

    planLayers.length = 0;
    markerLayers.length = 0;

    const vv = count*1;

    for(let i = 0 ; i < vv;i++)
    {
        const value = count2[i]*1;
        planviewCount.push(value);

        const imgs = [];
        const markers = [];
        planLayers.push(imgs);
        markerLayers.push(markers);
    }
}



export function clearplanview() {
    for(let i = 0 ; i < planLayers.length;i++)
    {
        for(let j = 0 ; j < planLayers[i].length;j++)
        {
            map.removeLayer(planLayers[i][j]);
        }
        planLayers[i].length = 0;
    }
}

export function SetOpacity(value) {

    value *= 1.0;
    opacity = value;

    for(let i = 0 ; i < planLayers.length;i++)
    {
        for(let j = 0 ; j < planLayers[i].length;j++)
        {
            planLayers[i][j].setOpacity(opacity);
        }
    }
}


function sendMessageToCSharp() {
    // C#으로 메시지 전송
    window.chrome.webview.postMessage('Hello from JavaScript!');
}


// const markerStyle = new ol.style.Style({
//     image: new ol.style.Icon({
//         anchor: [0.5, 1],
//         src: 'https://cdn-icons-png.flaticon.com/512/684/684908.png', // 마커 이미지 URL
//         scale: 0.06 // 크기 조정
//     }),
//     text: new ol.style.Text({
//         text: 'asd', // 표시할 텍스트
//         font: '14px Arial', // 글꼴과 크기
//         fill: new ol.style.Fill({ color: '#000' }), // 텍스트 색상
//         stroke: new ol.style.Stroke({ color: '#fff', width: 2 }), // 텍스트 외곽선
//         offsetY: -40 // 텍스트 위치 조정 (마커 위로)
//     })
// });

export function setmarker(index,lats,logs,names) {

    index = index*1;
    console.log('setmarker');
    console.log(names);
    let temp = names.split(",");
    console.log(temp);
    for(let i = 0 ; i < lats.length;i++)
    {
        const lat = lats[i]*1.0;
        const log = logs[i]*1.0;

        const markerStyle = new ol.style.Style({
            image: markerimg,
            text: new ol.style.Text({
                text: temp[i], // 표시할 텍스트
                font: '14px Arial', // 글꼴과 크기
                fill: new ol.style.Fill({ color: '#000' }), // 텍스트 색상
                stroke: new ol.style.Stroke({ color: '#fff', width: 2 }), // 텍스트 외곽선
                offsetY: -40 // 텍스트 위치 조정 (마커 위로)
            })
        });

        const marker = new ol.Feature({
            geometry: new ol.geom.Point(ol.proj.transform([log,lat], 'EPSG:4326','EPSG:3857')) // 마커 위치
        });
        // 스타일 적용
        marker.setStyle(markerStyle);
    
        // 벡터 소스 및 레이어 생성
        const vectorSource = new ol.source.Vector({
            features: [marker] // 마커 추가
        });

        const vectorLayer = new ol.layer.Vector({
            source: vectorSource,
            zIndex:10
        });

        markerLayers[index].push(vectorLayer);
    }
    console.log(index);
    console.log(markerLayers[index]);
}

export function onmarker(index) {
    console.log(index);
    index = index*1;
    for(let i = 0 ; i < markerLayers[index].length;i++)
    {
        map.addLayer(markerLayers[index][i]);
    }
}

export function hiddenmarker(index) {
    console.log(index);
    index = index*1;
    for(let i = 0 ; i < markerLayers[index].length;i++)
    {
        map.removeLayer(markerLayers[index][i]);
        
    }
}


let aniMaxCount = 0;
let aniCount = 0;
export function anistart(value) {
    aniCount = 0;
    aniMaxCount = value;
    console.log('anistart');
}



window.moveview = moveview;
window.addplanview = addplanview;
window.clearplanview = clearplanview;
window.setplanviewCount = setplanviewCount;
window.SetOpacity = SetOpacity;
window.Removeplanview = Removeplanview;
window.setmarker = setmarker;
window.onmarker = onmarker;
window.hiddenmarker = hiddenmarker;
window.anistart = anistart;

