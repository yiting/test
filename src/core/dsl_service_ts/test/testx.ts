import Path from 'path';
import designjson from './test.json';

// 引入的模块包
// import Dsl from '../dsl/dsl';
import Render from '../render/index';
import dslServer from '../dslService';
const value: any = dslServer.process(
  {
    nodes: designjson,
  },
  {
    outputType: 'h5',
    designWidth: 750,
    showTagAttrInfo: true,
    isLocalTest: true,
    applyInfo_user: 'testuser',
    applyInfo_url: 'testurl',
    applyInfo_proName: 'testproName',
    groups: [
      {
        type: 'absolute',
        ids: [
          '_F6636B38-28B3-4231-848B-2EBB5B8154C3_FAD3C145-6A39-4332-9D0F-1422F57F6D2E_89C6D683-06F1-49A9-AB39-050750FD0A7D_ACD5F5D0-6F67-4255-9C1D-15B5ACBF3987_01F6670B-0DF8-43BE-B123-56C54C434547',
          '65803A91-EF4B-4BF1-8E1F-2AC7A14FA8BB',
          '42AFAE0A-7210-4DC3-B3D4-0E615743C2AF',
          '2D4DD149-9047-4692-874F-934FC56131E1',
          'AB58E5A2-0850-468D-9D32-0B01C1B6A4E3',
          '3F76E72A-9542-47F7-849B-B56FCCEDB558',
          '370FD86E-B57B-4E4C-967A-380F002EFD01',
          'E8052627-9625-4151-A6BD-B29E05CB71BA',
          'AA3BB6B7-6338-403D-95FD-949BF793ED78',
          '41103163-E3D0-4212-BE1A-A9E0C61D891A',
          'DA506673-BA09-4D3F-B5E5-85D4875FF5B8',
          '481E07F3-B91F-48A5-8137-1C8801D1CBDE',
          '14E6B685-4CC2-4120-A08E-3D4ED6898951',
        ],
      },
      {
        type: 'absolute',
        ids: [
          '_FE1F364F-60C3-4595-A459-46AE51EA9F49_ED9E166C-6034-4C35-B958-6BC532F9F875_FC2F96C7-460C-43A4-8993-C4395DB50A44',
          '_71254032-08B9-49C5-8CF9-DC765570E6DF_73978E3E-8B0A-4352-A713-0C0AB87FACA4_7178E390-1CF7-494B-8AC9-076F544F84E5',
          '99137CFA-5CDF-439C-BA88-C68AD2E49CA8',
          '_BA5BF5E6-F62C-4A6D-BC89-BF470DBD9AC2_143F9AD9-94A5-48BD-9D0E-E0BDB0E0016B_4BB246D6-0A39-450A-A93C-8D3703B54FAA',
          '_F6732FE4-5C87-492C-BAFB-631F20236B0B_8727E760-3C01-481A-BC50-0B4B17256B89',
          '_7B4A111D-9103-4AEA-A952-B1D2693907CA_84891A30-93B2-41E1-B2DE-63A65F6E279B',
          '_5CB77D66-C867-4572-A6A0-8A159A838FD1_BAFEF74C-D910-4A25-9860-CBA575661B1C',
          '4F958743-1E6E-41F4-B323-8A94D6F01BC6',
          '2603A7A2-795F-4ECE-A492-BBAC5DA70C5C',
          'C090F58F-BFD8-4477-AF41-A42C79933AF4',
          '612DC509-48A9-4229-AABB-D8F102FBDAD3',
        ],
      },
    ],
  },
);

// // 输出文件
Render.outputFileWithPath(
  Path.join(__dirname, './output/index.html'),
  value.uiString,
);
Render.outputFileWithPath(
  Path.join(__dirname, './output/index.css'),
  value.styleString,
);
