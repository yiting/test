export default (width: number, height: number) => {
  return `local viewWidth = ${width}
local viewHeight = ${height}
local ViewModel = {}
ViewModel.__index = ViewModel


function ViewModel:New(view)
    self.view = view
    self.Transform = true
end

function ViewModel:OnSetMetaData(metaData)
    util.Clog("OnSetMetaData", metaData)
    self.data = metaData
end

-- 强制视图按照比例缩放
function ViewModel:OnResize(srcWidth, srcHeight, dstWidth, dstHeight)
    local width, height = self.view:GetSize()
    if self.Transform and width ~= srcWidth  then
        self:AdjustSize()
    end
end

function ViewModel:OnActivate(active)

end

function ViewModel:AdjustSize()
    util.Clog("AdjustSize")
    local width, height = self.view:GetSize()
    self.ratio = width / viewWidth

    if self.ratio ~= 1 then
        self.Transform = false
    end

    p_util.Transform(self.view, self.ratio, {"size", "margin", "font"}, {}, true)
    util.Clog('self.ratio', self.ratio)
    self.view:SetSize(width, viewWidth * self.ratio)
    --self.view:Update()
end

function getInstance(rootView)
	local model = {}
    setmetatable(model, ViewModel)
    model:New(rootView)
    return model
end
`;
};
